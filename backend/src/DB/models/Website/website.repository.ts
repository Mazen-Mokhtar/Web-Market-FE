import { Injectable } from "@nestjs/common";
import { Website, TWebsite } from "./website.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class WebsiteRepository {
    constructor(
        @InjectModel(Website.name) private websiteModel: Model<Website>
    ) { }

    async create(websiteData: Partial<Website>): Promise<TWebsite> {
        const website = new this.websiteModel(websiteData);
        return await website.save();
    }

    async findAll(query: any = {}): Promise<TWebsite[]> {
        return await this.websiteModel.find(query).populate('categoryId').populate('createdBy', 'name email').exec();
    }

    async findWithOptions(options: {
        filter?: any;
        sort?: any;
        limit?: number;
        skip?: number;
    }): Promise<TWebsite[]> {
        const { filter = {}, sort = {}, limit, skip = 0 } = options;

        let query = this.websiteModel
            .find(filter)
            .sort(sort)
            .skip(skip)
            .populate('categoryId')
            .populate('createdBy', 'name email')
        if (limit) {
            query = query.limit(limit);
        }

        return await query.exec();
    }

    async findById(id: string): Promise<TWebsite | null> {
        return await this.websiteModel.findById(id).populate('categoryId').populate('createdBy', 'name email').exec();
    }

    async findBySlug(slug: string): Promise<TWebsite | null> {
        return await this.websiteModel.findOne({ slug }).populate('categoryId').populate('createdBy', 'name email').exec();
    }

    async update(id: string, updateData: Partial<Website>): Promise<TWebsite | null> {
        return await this.websiteModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string): Promise<TWebsite | null> {
        return await this.websiteModel.findByIdAndDelete(id).exec();
    }

    async findByCategory(categoryId: string): Promise<TWebsite[]> {
        return await this.websiteModel.find({ categoryId }).populate('categoryId').populate('createdBy', 'name email').exec();
    }

    async findByType(type: string): Promise<TWebsite[]> {
        return await this.websiteModel.find({ type }).populate('categoryId').populate('createdBy', 'name email').exec();
    }

    async findAvailable(): Promise<TWebsite[]> {
        return await this.websiteModel.find({ status: 'available' }).populate('categoryId').populate('createdBy', 'name email').exec();
    }

    async incrementViews(id: string): Promise<void> {
        await this.websiteModel.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }).exec();
    }

    async markAsSold(id: string, soldTo: string): Promise<TWebsite | null> {
        return await this.websiteModel.findByIdAndUpdate(id, {
            status: 'sold',
            soldAt: new Date(),
            soldTo
        }, { new: true }).exec();
    }
} 