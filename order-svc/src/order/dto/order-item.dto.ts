import { IsString, IsInt, IsNumber } from 'class-validator';

export class OrderItemDto {
  @IsString()
  name: string;

  @IsInt()
  quantity: number;

  @IsNumber()
  unitPrice: number;
}
