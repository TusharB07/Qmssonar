import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IWCTypeOfEmployee {
    _id?: string;
    productId: string | IProduct;
    typeOfEmployee:string;
    maxSalary:number;
    maxNoOfEmployee:number;
    active: boolean;
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    partnerId: string | IPartner 
}