import { Test, TestingModule } from "@nestjs/testing";
import { PurposeSettingsController } from "./purpose-settings.controller";
import { PurposeSettingsService } from "./purpose-settings.service";

describe("PurposeSettingsController", () => {
  let controller: PurposeSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurposeSettingsController],
      providers: [PurposeSettingsService],
    }).compile();

    controller = module.get<PurposeSettingsController>(
      PurposeSettingsController
    );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
