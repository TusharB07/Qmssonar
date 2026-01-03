import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";
import { IBusinessType } from "../wc-business-type/wc-business-type.model";
import { ISalarySlabs } from "../wc-salary-slabs/wc-salary-slabs.model";

export interface IWCRates {
    _id?: string;
    productId: string | IProduct;
    businessTypeId:string | IBusinessType;
    salaryId:string | ISalarySlabs;
    rate:number;
    rateAbove:number;
    endorsementNo:string;
    classificationNo:string;
    effectiveStartDate:Date,
    active: boolean;
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    partnerId: string | IPartner 
}