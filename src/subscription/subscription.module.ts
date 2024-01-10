import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaService } from '../prisma.service';
import { CoingeckoModule } from '../coingecko/coingecko.module';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  imports: [CoingeckoModule, MetricsModule],
  providers: [SubscriptionService, PrismaService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
