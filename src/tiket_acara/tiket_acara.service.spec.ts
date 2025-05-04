import { Test, TestingModule } from '@nestjs/testing';
import { TiketAcaraService } from './tiket_acara.service';

describe('TiketAcaraService', () => {
  let service: TiketAcaraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiketAcaraService],
    }).compile();

    service = module.get<TiketAcaraService>(TiketAcaraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
