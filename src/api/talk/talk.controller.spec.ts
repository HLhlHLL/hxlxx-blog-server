import { Test, TestingModule } from '@nestjs/testing';
import { TalkController } from './talk.controller';
import { TalkService } from './talk.service';

describe('TalkController', () => {
  let controller: TalkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TalkController],
      providers: [TalkService],
    }).compile();

    controller = module.get<TalkController>(TalkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
