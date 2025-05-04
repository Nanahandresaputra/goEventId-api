import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { status_order } from '@prisma/client';

class OrderDto {
  @IsNotEmpty()
  @IsNumber()
  pemesanan_id: number;

  @IsNotEmpty()
  @IsNumber()
  tiket_acara_id: number;

  @IsOptional()
  status?: status_order;
}

export class CreatePemesananDto {
  // @IsArray()
  // @ArrayNotEmpty()
  // @ValidateNested({ each: true })
  // @Type(() => OrderDto)
  // orders: OrderDto[];

  @IsNotEmpty()
  @IsNumber()
  tiket_acara_id: number;

  @IsNotEmpty()
  @IsNumber()
  ticketQty: number;
}
