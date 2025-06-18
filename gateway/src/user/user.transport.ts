import { IsEmail, IsOptional, IsString, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { Expose } from 'class-transformer';

/* -------------------- DTO -------------------- */

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  offset?: number = 0;
}

/* -------------------- RDO -------------------- */

export class UserRdo {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

export class UsersRdo {
  @Expose()
  @Type(() => UserRdo)
  data: UserRdo[];

  @Expose()
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
