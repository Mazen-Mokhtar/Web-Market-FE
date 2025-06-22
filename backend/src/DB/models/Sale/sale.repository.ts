import { Injectable } from "@nestjs/common";
import { Sale, TSale } from "./sale.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class SaleRepository {
    constructor(
        @InjectModel(Sale.name) private saleModel: Model<TSale>
    ) { }

    async create(saleData: Partial<Sale>): Promise<TSale> {
        const sale = new this.saleModel(saleData);
        return await sale.save();
    }

    async findAll(query: any = {}): Promise<TSale[]> {
        return await this.saleModel.find(query)
            .populate('websiteId')
            .populate('buyerId', 'name email')
            .populate('sellerId', 'name email')
            .exec();
    }

    async findById(id: string): Promise<TSale | null> {
        return await this.saleModel.findById(id)
            .populate('websiteId')
            .populate('buyerId', 'name email')
            .populate('sellerId', 'name email')
            .exec();
    }

    async findBySaleId(saleId: string): Promise<TSale | null> {
        return await this.saleModel.findOne({ saleId })
            .populate('websiteId')
            .populate('buyerId', 'name email')
            .populate('sellerId', 'name email')
            .exec();
    }

    async update(id: string, updateData: Partial<Sale>): Promise<TSale | null> {
        return await this.saleModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string): Promise<TSale | null> {
        return await this.saleModel.findByIdAndDelete(id).exec();
    }

    async findByBuyer(buyerId: string): Promise<TSale[]> {
        return await this.saleModel.find({ buyerId })
            .populate('websiteId')
            .populate('buyerId', 'name email')
            .populate('sellerId', 'name email')
            .exec();
    }

    async findBySeller(sellerId: string): Promise<TSale[]> {
        return await this.saleModel.find({ sellerId })
            .populate('websiteId')
            .populate('buyerId', 'name email')
            .populate('sellerId', 'name email')
            .exec();
    }

    async findByStatus(status: string): Promise<TSale[]> {
        return await this.saleModel.find({ status })
            .populate('websiteId')
            .populate('buyerId', 'name email')
            .populate('sellerId', 'name email')
            .exec();
    }

    async findByWebsite(websiteId: string): Promise<TSale[]> {
        return await this.saleModel.find({ websiteId })
            .populate('websiteId')
            .populate('buyerId', 'name email')
            .populate('sellerId', 'name email')
            .exec();
    }

    async markAsCompleted(id: string): Promise<TSale | null> {
        return await this.saleModel.findByIdAndUpdate(id, { 
            status: 'completed', 
            completedAt: new Date() 
        }, { new: true }).exec();
    }

    async markAsDelivered(id: string): Promise<TSale | null> {
        return await this.saleModel.findByIdAndUpdate(id, { 
            isDelivered: true, 
            deliveredAt: new Date() 
        }, { new: true }).exec();
    }
} 