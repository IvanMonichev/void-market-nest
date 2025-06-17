import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async findAll(
    pagination: PaginationQueryDto,
  ): Promise<{ data: User[]; meta: any }> {
    const { limit = 10, offset = 0 } = pagination;

    const [data, total] = await Promise.all([
      this.userModel.find().skip(offset).limit(limit).exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return {
      data,
      meta: {
        total,
        limit,
        offset,
      },
    };
  }

  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, update: Partial<CreateUserDto>): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const res = await this.userModel.findByIdAndDelete(id).exec();
    if (!res) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { deleted: true };
  }
}
