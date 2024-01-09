import { Test, TestingModule } from '@nestjs/testing';
import { CoingeckoController } from './coingecko.controller';

describe('CoingeckoController', () => {
  let controller: CoingeckoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoingeckoController],
    }).compile();

    controller = module.get<CoingeckoController>(CoingeckoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
