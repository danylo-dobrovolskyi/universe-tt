import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoingeckoService } from './coingecko.service';
import { CoingeckoController } from './coingecko.controller';
import { MetricsModule } from 'src/metrics/metrics.module';

@Module({
  imports: [HttpModule, MetricsModule],
  providers: [CoingeckoService],
  exports: [CoingeckoService],
  controllers: [CoingeckoController],
})
export class CoingeckoModule {}
