import { Test, TestingModule } from '@nestjs/testing';
import { KabupatenkotaController } from './kabupatenkota.controller';
import { KabupatenkotaService } from './kabupatenkota.service';

describe('KabupatenkotaController', () => {
  let controller: KabupatenkotaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KabupatenkotaController],
      providers: [KabupatenkotaService],
    }).compile();

    controller = module.get<KabupatenkotaController>(KabupatenkotaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
