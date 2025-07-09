import { Test, TestingModule } from '@nestjs/testing';
import { KabupatenkotaService } from './kabupatenkota.service';

describe('KabupatenkotaService', () => {
  let service: KabupatenkotaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KabupatenkotaService],
    }).compile();

    service = module.get<KabupatenkotaService>(KabupatenkotaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
