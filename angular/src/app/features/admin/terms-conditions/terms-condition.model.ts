import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface ITermsConditions {
  _id?: string;
  type: string;
  productId: string | IProduct;
  partnerId: string | IPartner;
  description: string;
  section: string;
  active: boolean;
}