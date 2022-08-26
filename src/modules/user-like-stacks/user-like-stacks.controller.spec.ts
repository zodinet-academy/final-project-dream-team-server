import { Test, TestingModule } from "@nestjs/testing";
import { UserLikeStacksController } from "./user-like-stacks.controller";
import { UserLikeStacksService } from "./user-like-stacks.service";

describe("UserLikeStacksController", () => {
  let controller: UserLikeStacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserLikeStacksController],
      providers: [UserLikeStacksService],
    }).compile();

    controller = module.get<UserLikeStacksController>(UserLikeStacksController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
