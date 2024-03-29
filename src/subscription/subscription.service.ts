import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Subscription } from '@prisma/client';
import { CoingeckoService } from '../coingecko/coingecko.service';
import * as nodemailer from 'nodemailer';
import { lastValueFrom } from 'rxjs';
import { MetricsService } from '../metrics/metrics.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SubscriptionService {
  private lastSentRate: number | null = null;

  constructor(
    private prisma: PrismaService,
    private coingeckoService: CoingeckoService,
    private metricsService: MetricsService,
  ) {}

  // Subscribe a user's email to the mailing list
  async subscribe(email: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { email },
    });

    if (subscription) {
      if (subscription.status === 'subscribed') {
        throw new HttpException(
          'Email already subscribed',
          HttpStatus.CONFLICT,
        );
      }
      return this.updateSubscriptionStatus(email, 'subscribed');
    } else {
      this.metricsService.incrementEmailSubscriptionCount();
      return this.createSubscription(email);
    }
  }

  // Unsubscribe a user's email from the mailing list
  async unsubscribe(email: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { email },
    });

    if (!subscription) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    this.metricsService.incrementEmailUnsubscriptionCount();
    return this.updateSubscriptionStatus(email, 'unsubscribed');
  }

  // Updating user's email status
  private async updateSubscriptionStatus(
    email: string,
    status: 'subscribed' | 'unsubscribed',
  ): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { email },
      data: { status },
    });
  }

  // Creating subscription for user's email
  private async createSubscription(email: string): Promise<Subscription> {
    return this.prisma.subscription.create({
      data: { email, status: 'subscribed' },
    });
  }

  // Retrieve all emails with their subscription status
  async getAllEmails(): Promise<Subscription[]> {
    return this.prisma.subscription.findMany();
  }

  // Cron job to send daily rate notifications
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyRateNotification() {
    const rate = await lastValueFrom(this.coingeckoService.getCurrentBtcRate());
    await this.sendEmails(rate);
    this.lastSentRate = rate;
  }

  // Check if the rate has changed more than 5% and notify subscribers
  async checkRateAndNotify() {
    const currentRate = await lastValueFrom(
      this.coingeckoService.getCurrentBtcRate(),
    );

    if (
      this.lastSentRate === null ||
      this.hasChangedMoreThanFivePercent(currentRate)
    ) {
      await this.sendEmails(currentRate);
      this.lastSentRate = currentRate;
    }
  }

  // Helper method to determine if the rate has changed more than 5%
  private hasChangedMoreThanFivePercent(currentRate: number): boolean {
    if (this.lastSentRate === null) {
      return true;
    }

    const change =
      (Math.abs(currentRate - this.lastSentRate) / this.lastSentRate) * 100;
    return change > 5;
  }

  // Send email notifications to all subscribers
  public async sendEmails(rate: number): Promise<void> {
    const subject = 'Current BTC to UAH Rate';
    const text = `The current BTC to UAH rate is: ${rate} UAH.`;

    const subscribers = await this.prisma.subscription.findMany({
      where: { status: 'subscribed' },
    });

    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'b3c232d15d1b87',
        pass: '685996a606486a',
      },
    });

    for (const subscriber of subscribers) {
      if (subscriber.status === 'subscribed') {
        try {
          await transporter.sendMail({
            from: 'universe_tt@gmail.com',
            to: subscriber.email,
            subject: subject,
            text: text,
          });
          console.log(`Email sent to ${subscriber.email}`);
          this.metricsService.incrementEmailSentCount();
        } catch (error) {
          console.error(
            `Failed to send email to ${subscriber.email}: ${error}`,
          );
          this.metricsService.incrementEmailErrorCount();
        }
      }
    }
  }
}
