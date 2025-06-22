import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './User/user.module';
import { categoryModule } from './modules/category/category.module';
import { WebsiteModule } from './modules/website/website.module';
import { SaleModule } from './modules/sale/sale.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL as string),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    categoryModule,
    WebsiteModule,
    SaleModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
