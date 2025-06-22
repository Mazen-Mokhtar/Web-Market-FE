import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { User } from "src/commen/Decorator/user.decorator";
import { IAttachments } from "src/commen/multer/cloud.service";
import { Category } from "../Category/category.schema";

export enum WebsiteType {
    ECOMMERCE = "ecommerce",
    BLOG = "blog",
    PORTFOLIO = "portfolio",
    CORPORATE = "corporate",
    LANDING = "landing",
    DASHBOARD = "dashboard",
    OTHER = "other"
}

export enum WebsiteStatus {
    AVAILABLE = "available",
    SOLD = "sold",
    RESERVED = "reserved"
}

@Schema({ timestamps: true })
export class Website {
    @Prop({ type: String, required: true, maxlength: 100 })
    name: string;

    @Prop({
        type: String, maxlength: 150, default: function () {
            return slugify(this.name, { trim: true })
        }
    })
    slug: string;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true })
    demoUrl: string;

    @Prop({ type: String, required: false })
    sourceCodeUrl?: string;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: Number, required: false })
    originalPrice?: number;

    @Prop({ type: Number, required: false })
    discountPercent?: number;

    @Prop({ type: String, enum: WebsiteType, required: true })
    type: WebsiteType;

    @Prop({ type: String, enum: WebsiteStatus, default: WebsiteStatus.AVAILABLE })
    status: WebsiteStatus;

    @Prop({ type: [String], required: false })
    technologies: string[];

    @Prop({ type: [String], required: false })
    features: string[];

    @Prop({ type: Number, required: false })
    pagesCount?: number;

    @Prop({ type: Boolean, default: false })
    isResponsive: boolean;

    @Prop({ type: Boolean, default: false })
    hasAdminPanel: boolean;

    @Prop({ type: Boolean, default: false })
    hasDatabase: boolean;

    @Prop({ type: String, required: false })
    hostingInfo?: string;

    @Prop({ type: String, required: false })
    domainInfo?: string;

    @Prop(raw({
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    }))
    mainImage: IAttachments;

    @Prop(raw([{
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true }
    }]))
    gallery: IAttachments[];

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
    categoryId: Types.ObjectId;

    @Prop({ type: String, required: true })
    folderId: string;

    @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
    likes: Types.ObjectId[];

    @Prop({ type: Number, default: 0 })
    viewsCount: number;

    @Prop({ type: Date, required: false })
    soldAt?: Date;

    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    soldTo?: Types.ObjectId;
}

export const websiteSchema = SchemaFactory.createForClass(Website);

websiteSchema.pre("updateOne", function (next) {
    const update = this.getUpdate()
    if (update && update["name"]) {
        update["slug"] = slugify(update["name"], { trim: true })
        this.setUpdate(update)
    }
    next()
});

export type TWebsite = HydratedDocument<Website> 