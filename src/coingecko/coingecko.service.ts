import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CoingeckoService {
  constructor(private httpService: HttpService) {}

  getCurrentBtcRate(): Observable<number> {
    return this.httpService
      .get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=UAH',
      )
      .pipe(map((response) => response.data.bitcoin.uah));
  }
}
