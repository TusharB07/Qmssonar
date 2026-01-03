import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IProductPartnerConfiguration {
    _id?: string;
    productId: string | IProduct;
    partnerId: string | IPartner;
    locationCount: number;
    minCover: number;
    active: boolean;
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    copyPercentage:number;
}
