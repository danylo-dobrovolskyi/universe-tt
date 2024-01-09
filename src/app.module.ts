import { Module } from '@nestjs/common';
import { CoingeckoModule } from './coingecko/coingecko.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MetricsModule } from './metrics/metrics.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [CoingeckoModule, SubscriptionModule, MetricsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
