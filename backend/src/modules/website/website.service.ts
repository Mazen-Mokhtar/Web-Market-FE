import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { WebsiteRepository } from '../../DB/models/Website/website.repository';
import { Website, WebsiteType, WebsiteStatus } from '../../DB/models/Website/website.schema';
import { CreateWebsiteDto, UpdateWebsiteDto, QueryWebsiteDto } from './dto';
import { Types } from 'mongoose';
import { cloudService, IAttachments } from '../../commen/multer/cloud.service';

@Injectable()
export class WebsiteService {
  constructor(
    private readonly websiteRepository: WebsiteRepository,
    private readonly cloudService: cloudService
  ) { }

  async createWebsite(createWebsiteDto: CreateWebsiteDto, userId: string): Promise<Website> {
    const websiteData = {
      ...createWebsiteDto,
      createdBy: new Types.ObjectId(userId),
      categoryId: new Types.ObjectId(createWebsiteDto.categoryId),
      status: WebsiteStatus.AVAILABLE
    };

    return await this.websiteRepository.create(websiteData);
  }

  async getAllWebsites(query: QueryWebsiteDto = {}): Promise<Website[]> {
    const filter: any = {};
    const sort: any = {};

    // Search functionality
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { slug: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { technologies: { $in: [new RegExp(query.search, 'i')] } },
        { features: { $in: [new RegExp(query.search, 'i')] } }
      ];
    }

    // Category filter
    if (query.categoryId) {
      filter.categoryId = new Types.ObjectId(query.categoryId);
    }

    // Type filter
    if (query.type) {
      filter.type = query.type;
    }

    // Status filter
    if (query.status) {
      filter.status = query.status;
    }

    // Available filter (for backward compatibility)
    if (query.available === true) {
      filter.status = WebsiteStatus.AVAILABLE;
    }

    // Created by filter
    if (query.createdBy) {
      filter.createdBy = new Types.ObjectId(query.createdBy);
    }

    // Price range filter
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) {
        filter.price.$gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        filter.price.$lte = query.maxPrice;
      }
    }

    // Features filters
    if (query.isResponsive !== undefined) {
      filter.isResponsive = query.isResponsive;
    }

    if (query.hasAdminPanel !== undefined) {
      filter.hasAdminPanel = query.hasAdminPanel;
    }

    if (query.hasDatabase !== undefined) {
      filter.hasDatabase = query.hasDatabase;
    }

    // Technologies filter
    if (query.technologies && query.technologies.length > 0) {
      filter.technologies = { $in: query.technologies };
    }

    // Features filter
    if (query.features && query.features.length > 0) {
      filter.features = { $in: query.features };
    }

    // Sorting
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    sort[sortBy] = sortOrder;

    // Build the final query
    const finalQuery = {
      filter,
      sort
    };

    return await this.websiteRepository.findWithOptions(finalQuery);
  }

  async getAvailableWebsites(): Promise<Website[]> {
    return await this.websiteRepository.findAvailable();
  }

  async getWebsiteById(id: string): Promise<Website> {
    const website = await this.websiteRepository.findById(id);
    if (!website) {
      throw new NotFoundException('Website not found');
    }
    return website;
  }

  async getWebsiteBySlug(slug: string): Promise<Website> {
    const website = await this.websiteRepository.findBySlug(slug);
    if (!website) {
      throw new NotFoundException('Website not found');
    }
    // Increment views count
    await this.websiteRepository.incrementViews(website._id.toString());
    return website;
  }

  async updateWebsite(id: string, updateWebsiteDto: UpdateWebsiteDto, userId: string): Promise<Website> {
    const website = await this.websiteRepository.findById(id);
    if (!website) {
      throw new NotFoundException('Website not found');
    }

    if (website.createdBy.toString() !== userId) {
      throw new BadRequestException('You can only update your own websites');
    }

    // Convert categoryId to ObjectId if provided
    const { categoryId, ...restUpdateData } = updateWebsiteDto;
    const updateData: Partial<Website> = { ...restUpdateData };
    if (categoryId) {
      updateData.categoryId = new Types.ObjectId(categoryId);
    }

    const updatedWebsite = await this.websiteRepository.update(id, updateData);
    if (!updatedWebsite) {
      throw new NotFoundException('Website not found');
    }
    return updatedWebsite;
  }

  async deleteWebsite(id: string, userId: string): Promise<Website> {
    const website = await this.websiteRepository.findById(id);
    if (!website) {
      throw new NotFoundException('Website not found');
    }

    if (website.createdBy.toString() !== userId) {
      throw new BadRequestException('You can only delete your own websites');
    }

    // Delete all images from cloud
    if (website.mainImage?.public_id) {
      await this.cloudService.destroyFile(website.mainImage.public_id);
    }
    if (Array.isArray(website.gallery)) {
      for (const img of website.gallery) {
        if (img?.public_id) {
          await this.cloudService.destroyFile(img.public_id);
        }
      }
    }

    const deletedWebsite = await this.websiteRepository.delete(id);
    if (!deletedWebsite) {
      throw new NotFoundException('Website not found');
    }
    return deletedWebsite;
  }

  async getWebsitesByCategory(categoryId: string): Promise<Website[]> {
    return await this.websiteRepository.findByCategory(categoryId);
  }

  async getWebsitesByType(type: WebsiteType): Promise<Website[]> {
    return await this.websiteRepository.findByType(type);
  }

  async markWebsiteAsSold(id: string, buyerId: string): Promise<Website> {
    const website = await this.websiteRepository.findById(id);
    if (!website) {
      throw new NotFoundException('Website not found');
    }

    if (website.status !== WebsiteStatus.AVAILABLE) {
      throw new BadRequestException('Website is not available for sale');
    }

    const soldWebsite = await this.websiteRepository.markAsSold(id, buyerId);
    if (!soldWebsite) {
      throw new NotFoundException('Website not found');
    }
    return soldWebsite;
  }

  async getUserWebsites(userId: string): Promise<Website[]> {
    return await this.websiteRepository.findAll({ createdBy: userId });
  }

  async searchWebsites(searchTerm: string): Promise<Website[]> {
    const query = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { technologies: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    };
    return await this.websiteRepository.findAll(query);
  }

  async updateWebsiteImages(id: string, userId: string, files): Promise<Website> {
    const website = await this.websiteRepository.findById(id);
    if (!website) {
      throw new NotFoundException('Website not found');
    }
    if (website.createdBy.toString() !== userId) {
      throw new BadRequestException('You can only update your own websites');
    }
    let mainImage: IAttachments | undefined = undefined;
    let gallery: IAttachments[] | undefined = undefined;
    let folderId = String(Math.floor(100000 + Math.random() * 900000));
    if (files && files.length > 0) {
      gallery = await this.cloudService.uploadFiles(files, { folder: `${process.env.APP_NAME}/Website/${folderId}` });
      mainImage = gallery[0];
    }
    // حذف الصور القديمة من cloud
    if (files) {
      if (website.mainImage?.public_id) {
        await this.cloudService.destroyFile(website.mainImage.public_id);
      }
      if (Array.isArray(website.gallery)) {
        for (const img of website.gallery) {
          if (img?.public_id) {
            await this.cloudService.destroyFile(img.public_id);
          }
        }
      }
    }
    const updateData: Partial<Website> = {};
    if (mainImage) updateData.mainImage = mainImage;
    if (gallery) updateData.gallery = gallery;
    const updatedWebsite = await this.websiteRepository.update(id, updateData);
    if (!updatedWebsite) {
      throw new NotFoundException('Website not found');
    }
    return updatedWebsite;
  }
} 