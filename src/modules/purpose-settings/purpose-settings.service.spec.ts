import { Test, TestingModule } from "@nestjs/testing";
import { PurposeSettingsService } from "./purpose-settings.service";

describe("PurposeSettingsService", () => {
  let service: PurposeSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurposeSettingsService],
    }).compile();

    service = module.get<PurposeSettingsService>(PurposeSettingsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
