import { ILov } from "src/app/app.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IBscClauses {
    _id : string;
    bscType: string | ILov;
    productId: string | IProduct;
    partnerId: string | IPartner;
    description : string;
    active: boolean;
  }