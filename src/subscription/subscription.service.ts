import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Subscription } from '@prisma/client';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.subscription.update({
      where: { email },
      data: { status: 'unsubscribed' },
    });
  }

  async getAllEmails(): Promise<Subscription[]> {
    return this.prisma.subscription.findMany();
  }
}
