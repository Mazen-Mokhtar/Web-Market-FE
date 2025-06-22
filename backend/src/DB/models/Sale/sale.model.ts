import { MongooseModule } from "@nestjs/mongoose";
import { Sale, saleSchema } from "./sale.schema";

export const saleModel = MongooseModule.forFeature([{ name: Sale.name, schema: saleSchema }])