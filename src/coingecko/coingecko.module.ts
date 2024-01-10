import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoingeckoService } from './coingecko.service';
import { CoingeckoController } from './coingecko.controller';

@Module({
  imports: [HttpModule],
  providers: [CoingeckoService],
  exports: [CoingeckoService],
  controllers: [CoingeckoController],
})
export class CoingeckoModule {}
