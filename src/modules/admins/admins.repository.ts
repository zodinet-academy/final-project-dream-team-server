import { EntityRepository, Repository } from "typeorm";
import { AdminEntity } from "./entities/admins.entity";
import { IAdminsRepository } from "./interfaces";
@EntityRepository(AdminEntity)
export class AdminsRepository
  extends Repository<AdminEntity>
  implements IAdminsRepository {
  pagination: () => any;
}
