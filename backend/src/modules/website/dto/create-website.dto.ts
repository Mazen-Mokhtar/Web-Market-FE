import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsBoolean, IsUrl, Min, MaxLength } from 'class-validator';
import { WebsiteType } from '../../../DB/models/Website/website.schema';

export class CreateWebsiteDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(500)
  description: string;

  @IsUrl()
  demoUrl: string;

  @IsOptional()
  @IsUrl()
  sourceCodeUrl?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPercent?: number;

  @IsEnum(WebsiteType)
  type: WebsiteType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @IsOptional()
  @IsNumber()
  pagesCount?: number;

  @IsOptional()
  @IsBoolean()
  isResponsive?: boolean;

  @IsOptional()
  @IsBoolean()
  hasAdminPanel?: boolean;

  @IsOptional()
  @IsBoolean()
  hasDatabase?: boolean;

  @IsOptional()
  @IsString()
  hostingInfo?: string;

  @IsOptional()
  @IsString()
  domainInfo?: string;

  @IsString()
  categoryId: string;

} 