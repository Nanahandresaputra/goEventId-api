import { Test, TestingModule } from '@nestjs/testing';
import { TiketAcaraController } from './tiket_acara.controller';
import { TiketAcaraService } from './tiket_acara.service';

describe('TiketAcaraController', () => {
  let controller: TiketAcaraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiketAcaraController],
      providers: [TiketAcaraService],
    }).compile();

    controller = module.get<TiketAcaraController>(TiketAcaraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
