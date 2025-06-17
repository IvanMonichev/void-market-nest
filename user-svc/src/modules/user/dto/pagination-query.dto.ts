// src/modules/user/dto/pagination-query.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

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
