import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { hashPassword } from '@utils/password';
import { generateUsers } from '@utils/seed-users';
import { PaginatedResponse } from '@apps/shared/types';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(user: Partial<User>): Promise<User> {
    try {
      const hashedPassword = await hashPassword(user.password ?? '');
      return await this.userRepo.save({
        ...user,
        password: hashedPassword,
      });
    } catch (error: any) {
      this.logger.error(`Failed to create user: ${error.message}`);

      if (error.code === 11000) {
        throw new BadRequestException('Email already exists');
      }

      if (error.name === 'ValidationError') {
        throw new BadRequestException(error.message);
      }

      throw new BadRequestException('Failed to create user');
    }
  }

  async createMany(users: Partial<User>[]): Promise<User[]> {
    try {
      const created = await this.userRepo.save(users);
      return created;
    } catch (error: any) {
      this.logger.error(`Failed to create users: ${error.message}`);
      throw new BadRequestException('Failed to create users');
    }
  }

  async findOne(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findAll(
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items: users,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async deleteOne(id: string): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async update(
    id: string,
    attrs: Partial<User>,
    isAdmin = false,
  ): Promise<User> {
    if (attrs.email) {
      const existingUser = await this.findOne(attrs.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email is already in use');
      }
    }

    const updateData: Partial<User> = {
      ...attrs,
      isAdmin: isAdmin ? attrs.isAdmin : undefined,
      password: attrs.password ? await hashPassword(attrs.password) : undefined,
    };

    // Remove undefined values
    type UpdateKeys = keyof Partial<User>;
    Object.keys(updateData as Record<UpdateKeys, unknown>).forEach(
      key =>
        updateData[key as UpdateKeys] === undefined &&
        delete updateData[key as UpdateKeys],
    );

    try {
      await this.userRepo.update(id, updateData);
      const updatedUser = await this.findById(id);
      this.logger.log(`User ${id} updated successfully`);
      return updatedUser;
    } catch (error: any) {
      this.logger.error(`Failed to update user ${id}: ${error.message}`);
      throw new BadRequestException('Failed to update user');
    }
  }

  async adminUpdate(id: string, attrs: Partial<User>): Promise<User> {
    return this.update(id, attrs, true);
  }

  async deleteMany(): Promise<void> {
    try {
      await this.userRepo.clear();
      this.logger.log('All users deleted successfully');
    } catch (error: any) {
      this.logger.error(`Failed to delete users: ${error.message}`);
      throw new BadRequestException('Failed to delete users');
    }
  }

  async generateUsers(count: number): Promise<User[]> {
    const generatedUsers = await generateUsers(count);
    return this.createMany(generatedUsers);
  }
}
