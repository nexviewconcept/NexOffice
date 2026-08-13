import { Test, TestingModule } from '@nestjs/testing';
import { StaffProfilesController } from './staff-profiles.controller';

describe('StaffProfilesController', () => {
  let controller: StaffProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffProfilesController],
    }).compile();

    controller = module.get<StaffProfilesController>(StaffProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
