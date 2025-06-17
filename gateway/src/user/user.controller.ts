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
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { Client } from '../app.clients';

@Controller('users')
export class UserController {
  constructor(private readonly http: HttpService) {}

  @Post()
  async createUser(@Body() body: any, @Res() res: Response) {
    try {
      const { data } = await firstValueFrom(
        this.http.post(`${Client.UserService}/users`, body),
      );
      return res.status(HttpStatus.CREATED).json(data);
    } catch {
      throw new HttpException(
        'user service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Get(':id')
  async getUser(@Param('id') id: string, @Res() res: Response) {
    try {
      const { data } = await firstValueFrom(
        this.http.get(`${Client.UserService}/users/${id}`),
      );
      return res.status(HttpStatus.OK).json(data);
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
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      const { data } = await firstValueFrom(
        this.http.put(`${Client.UserService}/users/${id}`, body),
      );
      return res.status(HttpStatus.OK).json(data);
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
      await firstValueFrom(
        this.http.delete(`${Client.UserService}/users/${id}`),
      );
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch {
      throw new HttpException(
        'user service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  @Get('all')
  async getAllUsers(@Query() query: Record<string, any>, @Res() res: Response) {
    try {
      const { data } = await firstValueFrom(
        this.http.get(`${Client.UserService}/users/all`, {
          params: query,
        }),
      );
      return res.status(HttpStatus.OK).json(data);
    } catch {
      throw new HttpException(
        'user service unavailable',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
