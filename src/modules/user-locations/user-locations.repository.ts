import { EntityRepository, Repository } from "typeorm";
import { UserLocationEntity } from "./entities/user-location.entity";

@EntityRepository(UserLocationEntity)
export class UserLocationsRepository extends Repository<UserLocationEntity> {}
