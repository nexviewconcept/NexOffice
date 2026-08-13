import { Test, TestingModule } from '@nestjs/testing';
import { StaffProfilesService } from './staff-profiles.service';

describe('StaffProfilesService', () => {
  let service: StaffProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StaffProfilesService],
    }).compile();

    service = module.get<StaffProfilesService>(StaffProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
