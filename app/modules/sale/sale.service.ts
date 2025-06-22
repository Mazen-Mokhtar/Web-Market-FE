import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { SaleRepository } from '../../DB/models/Sale/sale.repository';
import { Sale, SaleStatus, PaymentMethod } from '../../DB/models/Sale/sale.schema';
import { CreateSaleDto, QuerySaleDto } from './dto';
import { Types } from 'mongoose';

@Injectable()
export class SaleService {
  constructor(private readonly saleRepository: SaleRepository) {}

  async createSale(createSaleDto: CreateSaleDto, buyerId: string): Promise<Sale> {
    const saleData = {
      ...createSaleDto,
      buyerId: new Types.ObjectId(buyerId),
      websiteId: new Types.ObjectId(createSaleDto.websiteId),
      sellerId: new Types.ObjectId(createSaleDto.sellerId),
      finalAmount: createSaleDto.amount - (createSaleDto.discountAmount || 0),
      status: SaleStatus.PENDING
    };

    return await this.saleRepository.create(saleData);
  }

  async getAllSales(query: QuerySaleDto = {}): Promise<Sale[]> {
    const filter: any = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.buyerId) {
      filter.buyerId = new Types.ObjectId(query.buyerId);
    }

    if (query.sellerId) {
      filter.sellerId = new Types.ObjectId(query.sellerId);
    }

    if (query.websiteId) {
      filter.websiteId = new Types.ObjectId(query.websiteId);
    }

    return await this.saleRepository.findAll(filter);
  }

  async getSaleById(id: string, userId: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Check if user has access to this sale
    if (
      sale.buyerId.toString() !== userId &&
      sale.sellerId.toString() !== userId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return sale;
  }

  async getSaleBySaleId(saleId: string, userId: string): Promise<Sale> {
    const sale = await this.saleRepository.findBySaleId(saleId);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Check if user has access to this sale
    if (
      sale.buyerId.toString() !== userId &&
      sale.sellerId.toString() !== userId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return sale;
  }

  async getUserPurchases(userId: string): Promise<Sale[]> {
    return await this.saleRepository.findByBuyer(userId);
  }

  async getUserSales(userId: string): Promise<Sale[]> {
    return await this.saleRepository.findBySeller(userId);
  }

  async markSaleAsCompleted(id: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    if (sale.status !== SaleStatus.PENDING) {
      throw new BadRequestException('Sale is not in pending status');
    }

    const updatedSale = await this.saleRepository.markAsCompleted(id);
    if (!updatedSale) {
      throw new NotFoundException('Sale not found');
    }

    return updatedSale;
  }

  async markSaleAsDelivered(id: string, userId: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Only seller can mark as delivered
    if (sale.sellerId.toString() !== userId) {
      throw new ForbiddenException('Only seller can mark sale as delivered');
    }

    if (sale.status !== SaleStatus.COMPLETED) {
      throw new BadRequestException('Sale must be completed before delivery');
    }

    const updatedSale = await this.saleRepository.markAsDelivered(id);
    if (!updatedSale) {
      throw new NotFoundException('Sale not found');
    }

    return updatedSale;
  }

  async confirmDelivery(id: string, userId: string, isBuyer: boolean): Promise<Sale> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    // Check if user is buyer or seller
    const isSeller = sale.sellerId.toString() === userId;
    const isBuyerUser = sale.buyerId.toString() === userId;

    if (!isSeller && !isBuyerUser) {
      throw new ForbiddenException('Access denied');
    }

    if (!sale.isDelivered) {
      throw new BadRequestException('Sale must be delivered first');
    }

    const updateData: any = {};
    if (isBuyer && isBuyerUser) {
      updateData.buyerConfirmed = true;
    } else if (!isBuyer && isSeller) {
      updateData.sellerConfirmed = true;
    } else {
      throw new BadRequestException('Invalid confirmation request');
    }

    const updatedSale = await this.saleRepository.update(id, updateData);
    if (!updatedSale) {
      throw new NotFoundException('Sale not found');
    }

    return updatedSale;
  }

  async processRefund(id: string, refundAmount: number, refundReason: string): Promise<Sale> {
    const sale = await this.saleRepository.findById(id);
    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    if (sale.status === SaleStatus.REFUNDED) {
      throw new BadRequestException('Sale is already refunded');
    }

    if (refundAmount > sale.finalAmount) {
      throw new BadRequestException('Refund amount cannot exceed sale amount');
    }

    const updateData = {
      status: SaleStatus.REFUNDED,
      refundAmount,
      refundReason,
      refundedAt: new Date()
    };

    const updatedSale = await this.saleRepository.update(id, updateData);
    if (!updatedSale) {
      throw new NotFoundException('Sale not found');
    }

    return updatedSale;
  }
}