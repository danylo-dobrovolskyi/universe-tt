import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Delete,
  Get,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CoingeckoService } from '../coingecko/coingecko.service';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
//import { lastValueFrom } from 'rxjs';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly coingeckoService: CoingeckoService,
  ) {}
  @Post('/subscribe')
  async subscribe(@Body('email') email: string, @Res() response: Response) {
    try {
      const subscription = await this.subscriptionService.subscribe(email);
      response.status(HttpStatus.CREATED).json(subscription);
    } catch (error) {
      response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Body('email') email: string, @Res() response: Response) {
    try {
      const subscription = await this.subscriptionService.unsubscribe(email);
      response.status(HttpStatus.OK).json(subscription);
    } catch (error) {
      response
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('/emails')
  async getAllEmails(@Res() response: Response) {
    try {
      const emails = await this.subscriptionService.getAllEmails();
      response.status(HttpStatus.OK).json(emails);
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Post('/send')
  async sendEmails(@Res() response: Response) {
    try {
      const rate = await lastValueFrom(
        this.coingeckoService.getCurrentBtcRate(),
      );
      await this.subscriptionService.sendEmails(rate);
      response
        .status(HttpStatus.OK)
        .json({ message: 'Emails sent successfully' });
    } catch (error) {
      response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
