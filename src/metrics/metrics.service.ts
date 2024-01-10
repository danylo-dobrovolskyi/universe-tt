import { Injectable } from '@nestjs/common';
import { Counter, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private emailSubscriptionCounter: Counter<string>;
  private emailUnsubscriptionCounter: Counter<string>;
  private emailSentCounter: Counter<string>;
  private emailErrorCounter: Counter<string>;
  private btcToUahRateGauge: Gauge<string>;

  // Initialize Prometheus metrics
  constructor() {
    this.initEmailSubscriptionCounter();
    this.initEmailUnsubscriptionCounter();
    this.initEmailSentCounter();
    this.initEmailErrorCounter();
    this.initBtcToUahRateGauge();
  }

  private initEmailSubscriptionCounter() {
    this.emailSubscriptionCounter = new Counter({
      name: 'email_subscription_count',
      help: 'Total number of email subscriptions',
    });
  }

  private initEmailUnsubscriptionCounter() {
    this.emailUnsubscriptionCounter = new Counter({
      name: 'email_unsubscription_count',
      help: 'Total number of email unsubscriptions',
    });
  }

  private initEmailSentCounter() {
    this.emailSentCounter = new Counter({
      name: 'email_sent_count',
      help: 'Total number of emails sent',
    });
  }

  private initEmailErrorCounter() {
    this.emailErrorCounter = new Counter({
      name: 'email_error_count',
      help: 'Total number of email sending errors',
    });
  }

  private initBtcToUahRateGauge() {
    this.btcToUahRateGauge = new Gauge({
      name: 'btc_to_uah_exchange_rate',
      help: 'Current BTC to UAH exchange rate',
    });
  }

  // Methods to increment the defined metrics
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

  // Update the BTC to UAH exchange rate gauge
  updateBtcToUahRate(rate: number) {
    this.btcToUahRateGauge.set(rate);
  }
}
