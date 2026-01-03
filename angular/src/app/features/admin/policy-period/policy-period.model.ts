import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IPolicyPeriod {
    _id?: string;
    name: string;
    productId: string | IProduct;
    partnerId: string | IPartner;
    active: boolean;
}