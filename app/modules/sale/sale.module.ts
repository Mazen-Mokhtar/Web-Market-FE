import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { SaleRepository } from '../../DB/models/Sale/sale.repository';
import { saleModel } from '../../DB/models/Sale/sale.model';
import { SharedModule } from '../../commen/sharedModules';

@Module({
  imports: [saleModel, SharedModule],
  controllers: [SaleController],
  providers: [SaleService, SaleRepository],
  exports: [SaleService, SaleRepository]
})
export class SaleModule {}