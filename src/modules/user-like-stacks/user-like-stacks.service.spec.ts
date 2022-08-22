import { Test, TestingModule } from "@nestjs/testing";
import { UserLikeStacksService } from "./user-like-stacks.service";

describe("UserLikeStacksService", () => {
  let service: UserLikeStacksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserLikeStacksService],
    }).compile();

    service = module.get<UserLikeStacksService>(UserLikeStacksService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
