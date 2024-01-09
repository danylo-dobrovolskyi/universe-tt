import { Module } from '@nestjs/common';
import { CoingeckoModule } from './coingecko/coingecko.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [CoingeckoModule, SubscriptionModule, MetricsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
