import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserHobbiesProfile } from "./user-hobbies.profile";
import { UserHobbiesRepository } from "./user-hobbies.repository";
import { UserHobbiesService } from "./user-hobbies.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserHobbiesRepository])],
  providers: [UserHobbiesService, UserHobbiesProfile],
  exports: [UserHobbiesService],
})
export class UserHobbiesModule {}
