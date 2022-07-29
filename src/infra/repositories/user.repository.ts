import { UserEntity } from './../../core/domain/entities/user.entity';
import { CreatedUserDto } from './../../shared/dtos/user/created-user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from 'src/core/repositories/user.repository';

@Injectable()
export class DatabaseUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}
  create(data: UserEntity): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  update(id: number, data: UserEntity): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  patch(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  getById(id: number): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
  getOne(filter: Partial<UserEntity>): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
  getMany(filter: Partial<UserEntity>): Promise<UserEntity[]> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
