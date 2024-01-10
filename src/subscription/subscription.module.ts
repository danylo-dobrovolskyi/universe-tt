import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '../prisma.service';
import { CoingeckoModule } from '../coingecko/coingecko.module';

@Module({
  imports: [CoingeckoModule],
  providers: [SubscriptionService, PrismaService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
