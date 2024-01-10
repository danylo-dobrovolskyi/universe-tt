import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { CoingeckoService } from './coingecko.service';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';

@Controller('rate')
export class CoingeckoController {
  constructor(private readonly coingeckoService: CoingeckoService) {}

  // Retrieve the current BTC to UAH exchange rate
  @Get()
  async getBtcRate(@Res() response: Response) {
    try {
      const rate = await lastValueFrom(
        this.coingeckoService.getCurrentBtcRate(),
      );
      response.status(HttpStatus.OK).json({ btcToUah: rate });
    } catch (error) {
      // Handle any potential errors during the API call
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
