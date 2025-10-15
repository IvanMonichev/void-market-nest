import { IsString, IsInt, IsNumber, IsPositive } from 'class-validator';

export class OrderItemDto {
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}
