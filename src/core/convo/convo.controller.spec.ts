import { Test, TestingModule } from '@nestjs/testing';
import { ConvoController } from './convo.controller';

describe('ConvoController', () => {
  let controller: ConvoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvoController],
    }).compile();

    controller = module.get<ConvoController>(ConvoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
