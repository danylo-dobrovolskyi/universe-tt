import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Subscription } from '@prisma/client';
import { CoingeckoService } from '../coingecko/coingecko.service';
import * as nodemailer from 'nodemailer';
import { lastValueFrom } from 'rxjs';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prisma: PrismaService,
    private coingeckoService: CoingeckoService,
    private metricsService: MetricsService,
  ) {}

  async subscribe(email: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { email },
    });

    if (subscription && subscription.status === 'subscribed') {
      throw new HttpException('Email already subscribed', HttpStatus.CONFLICT);
    }

    if (subscription && subscription.status === 'unsubscribed') {
      return this.prisma.subscription.update({
        where: { email },
        data: { status: 'subscribed' },
      });
    }

    this.metricsService.incrementEmailSubscriptionCount();
    return this.prisma.subscription.create({
      data: { email, status: 'subscribed' },
    });
  }

  async unsubscribe(email: string): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { email },
    });

    if (!subscription) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    this.metricsService.incrementEmailUnsubscriptionCount();
    return this.prisma.subscription.update({
      where: { email },
      data: { status: 'unsubscribed' },
    });
  }

  async getAllEmails(): Promise<Subscription[]> {
    return this.prisma.subscription.findMany();
  }

  async sendEmails(): Promise<void> {
    const rate = await lastValueFrom(this.coingeckoService.getCurrentBtcRate());

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
