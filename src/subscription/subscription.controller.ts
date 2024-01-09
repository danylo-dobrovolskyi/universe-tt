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
import { Response } from 'express';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

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
}
