import { Test, TestingModule } from '@nestjs/testing';
import { PenyelenggaraController } from './penyelenggara.controller';
import { PenyelenggaraService } from './penyelenggara.service';

describe('PenyelenggaraController', () => {
  let controller: PenyelenggaraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PenyelenggaraController],
      providers: [PenyelenggaraService],
    }).compile();

    controller = module.get<PenyelenggaraController>(PenyelenggaraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
