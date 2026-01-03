import { IIndustryType } from "../industry-type/industry-type.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export enum AllowedTaskStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed"
}
export interface IBranchMaster {
  _id?: string;
    zone:string;
  name: string
  code: number;
 active: boolean;
  partnerId: string | IPartner
}
