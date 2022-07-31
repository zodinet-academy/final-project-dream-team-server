import { Repository } from "@/common/repository";
import { User } from "./entities/user.entity";
import { IUserRepository } from "./interfaces/user-repository.interface";
export class UserRepository
  extends Repository<User>
  implements IUserRepository {
  getUserByFullName(fullname: string): Promise<User> {
    console.log(fullname);
    throw new Error("Method not implemented.");
  }
  create(data: User): Promise<User> {
    console.log(data);
    throw new Error("Method not implemented.");
  }
  update(id: number, data: User): Promise<User> {
    console.log(id, data);
    throw new Error("Method not implemented.");
  }
  getById(id: number): Promise<User> {
    console.log(id);
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  delete(id: number): Promise<void> {
    console.log(id);
    throw new Error("Method not implemented.");
  }
}
