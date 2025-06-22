import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto, QuerySaleDto } from './dto';
import { AuthGuard } from '../../commen/Guards/auth.guard';
import { RolesGuard } from '../../commen/Guards/role.guard';
import { Roles } from '../../commen/Decorator/roles.decorator';
import { User } from '../../commen/Decorator/user.decorator';
import { RoleTypes } from 'src/DB/models/User/user.schema';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createSaleDto: CreateSaleDto, @User('_id') userId: string) {
    return await this.saleService.createSale(createSaleDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleTypes.ADMIN])
  async findAll(@Query() query: QuerySaleDto) {
    return await this.saleService.getAllSales(query);
  }

  @Get('my-purchases')
  @UseGuards(AuthGuard)
  async getMyPurchases(@User('_id') userId: string) {
    return await this.saleService.getUserPurchases(userId);
  }

  @Get('my-sales')
  @UseGuards(AuthGuard)
  async getMySales(@User('_id') userId: string) {
    return await this.saleService.getUserSales(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @User('_id') userId: string) {
    return await this.saleService.getSaleById(id, userId);
  }

  @Get('sale-id/:saleId')
  @UseGuards(AuthGuard)
  async findBySaleId(@Param('saleId') saleId: string, @User('_id') userId: string) {
    return await this.saleService.getSaleBySaleId(saleId, userId);
  }

  @Post(':id/complete')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleTypes.ADMIN])
  async markAsCompleted(@Param('id') id: string) {
    return await this.saleService.markSaleAsCompleted(id);
  }

  @Post(':id/deliver')
  @UseGuards(AuthGuard)
  async markAsDelivered(@Param('id') id: string, @User('_id') userId: string) {
    return await this.saleService.markSaleAsDelivered(id, userId);
  }

  @Post(':id/confirm-delivery')
  @UseGuards(AuthGuard)
  async confirmDelivery(
    @Param('id') id: string,
    @User('_id') userId: string,
    @Body('isBuyer') isBuyer: boolean
  ) {
    return await this.saleService.confirmDelivery(id, userId, isBuyer);
  }

  @Post(':id/refund')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleTypes.ADMIN])
  async processRefund(
    @Param('id') id: string,
    @Body('refundAmount') refundAmount: number,
    @Body('refundReason') refundReason: string
  ) {
    return await this.saleService.processRefund(id, refundAmount, refundReason);
  }
}