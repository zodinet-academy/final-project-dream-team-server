import { Mapper } from 'src/core/base/mapper';
import { CreateUserDto } from 'src/shared/dtos/user/create-user.dto';
import { UserEntity } from '../entities/user.entity';

export class CreateUserMapper extends Mapper<CreateUserDto, UserEntity> {
  public mapFrom(data: CreateUserDto): UserEntity {
    const user = new UserEntity();

    user.name = data.name;
    user.email = data.email;
    user.password = data.password;

    return user;
  }

  public mapTo(data: UserEntity): CreateUserDto {
    const user = new CreateUserDto();

    user.name = data.name;
    user.email = data.email;
    user.password = data.password;

    return user;
  }
}
