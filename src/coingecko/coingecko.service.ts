import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class CoingeckoService {
  constructor(
    private httpService: HttpService,
    private metricsService: MetricsService,
  ) {}

  getCurrentBtcRate(): Observable<number> {
    return this.httpService
      .get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=UAH',
      )
      .pipe(
        map((response) => {
          const rate = response.data.bitcoin.uah;
          this.metricsService.updateBtcToUahRate(rate);
          return rate;
        }),
      );
  }
}
