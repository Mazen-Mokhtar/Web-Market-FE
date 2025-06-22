import { Prop, raw, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "src/commen/Decorator/user.decorator";
import { Website } from "../Website/website.schema";

export enum SaleStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}

export enum PaymentMethod {
    CARD = "card",
    BANK_TRANSFER = "bank_transfer",
    PAYPAL = "paypal",
    CRYPTO = "crypto"
}

@Schema({ timestamps: true })
export class Sale {
    @Prop({ type: String, required: true })
    saleId: string;

    @Prop({ type: Types.ObjectId, ref: Website.name, required: true })
    websiteId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    buyerId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    sellerId: Types.ObjectId;

    @Prop({ type: Number, required: true })
    amount: number;

    @Prop({ type: Number, required: false })
    discountAmount?: number;

    @Prop({ type: Number, required: true })
    finalAmount: number;

    @Prop({ type: String, enum: PaymentMethod, required: true })
    paymentMethod: PaymentMethod;

    @Prop({ type: String, enum: SaleStatus, default: SaleStatus.PENDING })
    status: SaleStatus;

    @Prop({ type: String, required: false })
    transactionId?: string;

    @Prop({ type: Date, required: false })
    paidAt?: Date;

    @Prop({ type: Date, required: false })
    completedAt?: Date;

    @Prop({ type: String, required: false })
    notes?: string;

    @Prop({ type: String, required: false })
    refundReason?: string;

    @Prop({ type: Date, required: false })
    refundedAt?: Date;

    @Prop({ type: Number, required: false })
    refundAmount?: number;

    @Prop({ type: String, required: false })
    deliveryMethod?: string;

    @Prop({ type: String, required: false })
    deliveryDetails?: string;

    @Prop({ type: Date, required: false })
    deliveredAt?: Date;

    @Prop({ type: Boolean, default: false })
    isDelivered: boolean;

    @Prop({ type: Boolean, default: false })
    buyerConfirmed: boolean;

    @Prop({ type: Boolean, default: false })
    sellerConfirmed: boolean;
}

export const saleSchema = SchemaFactory.createForClass(Sale);

// Generate sale ID before saving
saleSchema.pre('save', function(next) {
    if (!this.saleId) {
        this.saleId = 'SALE-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    }
    next();
});

export type TSale = HydratedDocument<Sale> 