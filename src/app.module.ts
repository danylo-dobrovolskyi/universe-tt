import { Module } from '@nestjs/common';
import { CoingeckoModule } from './coingecko/coingecko.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MetricsModule } from './metrics/metrics.module';
import { PrismaService } from './prisma.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CoingeckoModule,
    SubscriptionModule,
    MetricsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
