import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { WebsiteService } from './website.service';
import { CreateWebsiteDto, UpdateWebsiteDto, QueryWebsiteDto } from './dto';
import { AuthGuard } from '../../commen/Guards/auth.guard';
import { RolesGuard } from '../../commen/Guards/role.guard';
import { Roles } from '../../commen/Decorator/roles.decorator';
import { User } from '../../commen/Decorator/user.decorator';
import { cloudService, IAttachments } from '../../commen/multer/cloud.service';
import { RoleTypes } from 'src/DB/models/User/user.schema';

@Controller('websites')
export class WebsiteController {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly cloudService: cloudService
  ) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleTypes.ADMIN])
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() createWebsiteDto: CreateWebsiteDto,
    @User('_id') userId: string,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    // Handle image uploads
    let mainImage = {}
    let gallery: IAttachments[] = []
    let folderId = String(Math.floor(100000 + Math.random() * 900000))
    if (files && files.length > 0) {
      gallery = await this.cloudService.uploadFiles(files, { folder: `${process.env.APP_NAME}/Website/${folderId}` })
      mainImage = gallery[0]
    }


    const websiteData = {
      ...createWebsiteDto,
      mainImage,
      gallery
    };

    return await this.websiteService.createWebsite(websiteData, userId);
  }

  @Get()
  async findAll(@Query() query: QueryWebsiteDto) {
    if (query.search) {
      return await this.websiteService.searchWebsites(query.search);
    }
    if (query.categoryId) {
      return await this.websiteService.getWebsitesByCategory(query.categoryId);
    }
    if (query.type) {
      return await this.websiteService.getWebsitesByType(query.type);
    }
    if (query.available === true) {
      return await this.websiteService.getAvailableWebsites();
    }
    return await this.websiteService.getAllWebsites(query);
  }

  @Get('available')
  async getAvailableWebsites() {
    return await this.websiteService.getAvailableWebsites();
  }

  @Get('my-websites')
  @UseGuards(AuthGuard)
  async getMyWebsites(@User('_id') userId: string) {
    return await this.websiteService.getUserWebsites(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.websiteService.getWebsiteById(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return await this.websiteService.getWebsiteBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleTypes.ADMIN])
  async update(
    @Param('id') id: string,
    @Body() updateWebsiteDto: UpdateWebsiteDto,
    @User('_id') userId: string
  ) {
    return await this.websiteService.updateWebsite(id, updateWebsiteDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleTypes.ADMIN])
  async remove(@Param('id') id: string, @User('_id') userId: string) {
    return await this.websiteService.deleteWebsite(id, userId);
  }

  @Post(':id/buy')
  @UseGuards(AuthGuard)
  async buyWebsite(@Param('id') id: string, @User('_id') userId: string) {
    return await this.websiteService.markWebsiteAsSold(id, userId);
  }

  @Patch(':id/images')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles([RoleTypes.ADMIN])
  @UseInterceptors(FilesInterceptor('images', 10))
  async updateImages(
    @Param('id') id: string,
    @User('_id') userId: string,
    @UploadedFiles() files?: Express.Multer.File[]
  ) {
    
    return await this.websiteService.updateWebsiteImages(id, userId,files);
  }
} 