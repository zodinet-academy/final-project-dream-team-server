import { ISystemUsersRepository } from "./interfaces/system-users-repository.interface";
import { EntityRepository, Repository } from "typeorm";
import { SystemUserEntity } from "./entities/system-user.entity";
@EntityRepository(SystemUserEntity)
export class SystemUsersRepository
  extends Repository<SystemUserEntity>
  implements ISystemUsersRepository {
  pagination: () => any;
}
