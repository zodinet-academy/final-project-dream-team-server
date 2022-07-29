import { UseCase } from 'src/core/base/use-case';
import { CreatedUserMapper } from 'src/core/domain/mappers/created-user-mapper';
import { UserRepository } from 'src/core/repositories/user.repository';
import { CreatedUserDto } from 'src/shared/dtos/user/created-user.dto';

export class GetAllUsersUseCase implements UseCase<CreatedUserDto[]> {
  private CreatedUserMapper: CreatedUserMapper;

  constructor(private readonly repository: UserRepository) {
    this.CreatedUserMapper = new CreatedUserMapper();
  }

  public async execute(): Promise<CreatedUserDto[]> {
    const users = await this.repository.getAll();
    return users.map((user) => this.CreatedUserMapper.mapTo(user));
  }
}
