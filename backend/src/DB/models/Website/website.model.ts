import { MongooseModule } from "@nestjs/mongoose";
import { Website, websiteSchema } from "./website.schema";

export const websiteModel = MongooseModule.forFeature([{ name: Website.name, schema: websiteSchema }])