import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface ISalarySlabs {
    _id?: string;
    productId: string | IProduct;
    fromSalary:number;
    toSalary:number;
    salaryStr:string;
    effectiveStartDate:Date;
    active: boolean;
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    partnerId: string | IPartner 
}