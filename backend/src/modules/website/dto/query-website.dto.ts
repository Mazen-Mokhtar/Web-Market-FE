import { IsOptional, IsString, IsEnum, IsBoolean, IsMongoId, Min, Max, IsNumber, IsArray, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { WebsiteType, WebsiteStatus } from '../../../DB/models/Website/website.schema';

export class QueryWebsiteDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsEnum(WebsiteType)
  type?: WebsiteType;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsEnum(WebsiteStatus)
  status?: WebsiteStatus;

  @IsOptional()
  @IsMongoId()
  createdBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isResponsive?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasAdminPanel?: boolean;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasDatabase?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  technologies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
  features?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['name', 'price', 'createdAt', 'viewsCount', 'type', 'status'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
} 