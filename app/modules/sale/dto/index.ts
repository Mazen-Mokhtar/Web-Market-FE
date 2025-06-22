import { IsString, IsNumber, IsEnum, IsOptional, IsMongoId, Min } from 'class-validator';
import { PaymentMethod } from '../../../DB/models/Sale/sale.schema';

export class CreateSaleDto {
  @IsMongoId()
  websiteId: string;

  @IsMongoId()
  sellerId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  deliveryMethod?: string;

  @IsOptional()
  @IsString()
  deliveryDetails?: string;
}

export class QuerySaleDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsMongoId()
  buyerId?: string;

  @IsOptional()
  @IsMongoId()
  sellerId?: string;

  @IsOptional()
  @IsMongoId()
  websiteId?: string;
}