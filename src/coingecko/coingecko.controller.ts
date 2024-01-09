import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Controller('rate')
export class CoingeckoController {
  constructor(private readonly coingeckoService: CoingeckoService) {}

  @Get()
  async getBtcRate(@Res() response: Response) {
    try {
      const rate = await lastValueFrom(
        this.coingeckoService.getCurrentBtcRate(),
      );
      console.log('BTC to UAH price: ' + rate);
      response.status(HttpStatus.OK).json({ btcToUah: rate });
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
