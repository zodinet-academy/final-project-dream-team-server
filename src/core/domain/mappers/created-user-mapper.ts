import { Mapper } from 'src/core/base/mapper';
import { CreatedUserDto } from 'src/shared/dtos/user/created-user.dto';
import { UserEntity } from '../entities/user.entity';

export class CreatedUserMapper implements Mapper<CreatedUserDto, UserEntity> {
  public mapFrom(data: CreatedUserDto): UserEntity {
    const user = new UserEntity();

    user.id = data.id;
    user.name = data.name;
    user.email = data.email;

    return user;
  }

  public mapTo(data: UserEntity): CreatedUserDto {
    const user = new CreatedUserDto();

    user.id = data.id;
    user.name = data.name;
    user.email = data.email;

    return user;
  }
}
