import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Website, websiteSchema } from '../../DB/models/Website/website.schema';
import { WebsiteRepository } from '../../DB/models/Website/website.repository';
import { websiteModel } from 'src/DB/models/Website/website.model';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';
import { cloudService } from '../../commen/multer/cloud.service';

@Module({
  imports: [
    websiteModel
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService, WebsiteRepository, cloudService],
  exports: [WebsiteService, WebsiteRepository]
})
export class WebsiteModule {} 