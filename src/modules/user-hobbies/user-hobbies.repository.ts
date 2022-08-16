import { EntityRepository, Repository } from "typeorm";
import { UserHobbyEntity } from "./entities/user-hobbies.entity";

@EntityRepository(UserHobbyEntity)
export class UserHobbiesRepository extends Repository<UserHobbyEntity> {}
