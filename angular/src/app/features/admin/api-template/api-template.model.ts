import { ILov } from "src/app/app.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IApiTemplate {
    _id?: string;
    url: string,
    jsonString: string,
    sequenceNumber: number,
    partnerId: string | IPartner,
    productId: string | IProduct
}

