import { EntityRepository, Repository } from "typeorm";
import { UserImageEntity } from "./entities/user-images.entity";

@EntityRepository(UserImageEntity)
export class UserImagesRepository extends Repository<UserImageEntity> {}
