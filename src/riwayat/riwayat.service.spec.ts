import { Test, TestingModule } from '@nestjs/testing';
import { RiwayatService } from './riwayat.service';

describe('RiwayatService', () => {
  let service: RiwayatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiwayatService],
    }).compile();

    service = module.get<RiwayatService>(RiwayatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
