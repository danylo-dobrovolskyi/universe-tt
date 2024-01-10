import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';
import { Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private emailSubscriptionCounter: Counter<string>;
  private emailUnsubscriptionCounter: Counter<string>;
  private emailSentCounter: Counter<string>;
  private emailErrorCounter: Counter<string>;
  private btcToUahRateGauge: Gauge<string>;

  constructor() {
    this.emailSubscriptionCounter = new Counter({
      name: 'email_subscription_count',
      help: 'Total number of email subscriptions',
    });

    this.emailUnsubscriptionCounter = new Counter({
      name: 'email_unsubscription_count',
      help: 'Total number of email unsubscriptions',
    });

    this.emailSentCounter = new Counter({
      name: 'email_sent_count',
      help: 'Total number of emails sent',
    });

    this.emailErrorCounter = new Counter({
      name: 'email_error_count',
      help: 'Total number of email sending errors',
    });

    this.btcToUahRateGauge = new Gauge({
      name: 'btc_to_uah_exchange_rate',
      help: 'Current BTC to UAH exchange rate',
    });
  }

  incrementEmailSubscriptionCount() {
    this.emailSubscriptionCounter.inc();
  }

  incrementEmailUnsubscriptionCount() {
    this.emailUnsubscriptionCounter.inc();
  }

  incrementEmailSentCount() {
    this.emailSentCounter.inc();
  }

  incrementEmailErrorCount() {
    this.emailErrorCounter.inc();
  }

  updateBtcToUahRate(rate: number) {
    this.btcToUahRateGauge.set(rate);
  }
}
