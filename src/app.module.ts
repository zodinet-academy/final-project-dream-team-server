import { Logger, Module } from "@nestjs/common";
import { UsersModule } from "./modules/users/users.module";

@Module({
  providers: [Logger],
  imports: [UsersModule],
})
export class AppModule {}
