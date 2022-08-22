import { EntityRepository, Repository } from "typeorm";
import { UserLikeStackEntity } from "./entities/user-like-stack.entity";

@EntityRepository(UserLikeStackEntity)
export class UserLikeStacksRepository extends Repository<UserLikeStackEntity> {}
