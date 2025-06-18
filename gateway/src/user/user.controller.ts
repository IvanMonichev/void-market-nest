import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AxiosClient } from 'src/http/http.service';
import { Client } from 'src/app.clients';
import {
  CreateUserDto,
  UpdateUserDto,
  UserRdo,
  UsersRdo,
  PaginationQueryDto,
} from './user.transport';

@Controller('users')
export class UserController {
  constructor(private readonly http: AxiosClient) {}

  @Post()
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    try {
      const created = await this.http.post<UserRdo>(
        `${Client.UserService}`,
        body,
      );
      return res.status(HttpStatus.CREATED).json(created);
    } catch {
      throw new HttpException(
        'user service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Get('all')
  async getAllUsers(@Query() query: PaginationQueryDto, @Res() res: Response) {
    try {
      const result = await this.http.get<UsersRdo>(
        `${Client.UserService}/all`,
        { params: query },
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      throw new HttpException(
        `user service unavailable ${e}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.http.get<UserRdo>(`${Client.UserService}/${id}`);
      return res.status(HttpStatus.OK).json(user);
    } catch {
      throw new HttpException(
        'user service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const updated = await this.http.put<UserRdo>(
        `${Client.UserService}/${id}`,
        body,
      );
      return res.status(HttpStatus.OK).json(updated);
    } catch {
      throw new HttpException(
        'user service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.http.delete(`${Client.UserService}/${id}`);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch {
      throw new HttpException(
        'user service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
