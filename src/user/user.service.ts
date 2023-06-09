import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async createUser(user: Partial<User>): Promise<User> {
    return await this.userRepository.save(user);
  }

  async updateUser(user: Partial<User>): Promise<User> {
    if (user.password) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(user.password, salt);
    }

    if (user.email) user.email = user.email.toUpperCase();

    return await this.userRepository.save(user);
  }
}
