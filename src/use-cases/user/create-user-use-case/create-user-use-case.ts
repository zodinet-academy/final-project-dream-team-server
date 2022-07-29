import { CreateUserMapper } from '../../../core/domain/mappers/create-user-mapper';
import { UseCase } from '../../../core/base/use-case';
import { CreatedUserDto } from '../../../shared/dtos/user/created-user.dto';
import { CreatedUserMapper } from 'src/core/domain/mappers/created-user-mapper';
import { UserRepository } from 'src/core/repositories/user.repository';
import { CreateUserDto } from 'src/shared/dtos/user/create-user.dto';
export class CreateUserUseCase implements UseCase<CreatedUserDto> {
  private CreateUserMapper: CreateUserMapper;
  private CreatedUserMapper: CreatedUserMapper;

  constructor(private readonly repository: UserRepository) {
    this.CreateUserMapper = new CreateUserMapper();
    this.CreatedUserMapper = new CreatedUserMapper();
  }

  public async execute(user: CreateUserDto): Promise<CreatedUserDto> {
    const entity = this.CreateUserMapper.mapFrom(user);
    const createdUser = await this.repository.create(entity);
    return this.CreatedUserMapper.mapTo(createdUser);
  }
}
