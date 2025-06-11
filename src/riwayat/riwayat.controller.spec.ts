import { Test, TestingModule } from '@nestjs/testing';
import { RiwayatController } from './riwayat.controller';
import { RiwayatService } from './riwayat.service';

describe('RiwayatController', () => {
  let controller: RiwayatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiwayatController],
      providers: [RiwayatService],
    }).compile();

    controller = module.get<RiwayatController>(RiwayatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
