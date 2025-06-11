import { Test, TestingModule } from '@nestjs/testing';
import { PenyelenggaraService } from './penyelenggara.service';

describe('PenyelenggaraService', () => {
  let service: PenyelenggaraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PenyelenggaraService],
    }).compile();

    service = module.get<PenyelenggaraService>(PenyelenggaraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
