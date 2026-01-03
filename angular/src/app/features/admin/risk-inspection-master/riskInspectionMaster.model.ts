import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IRiskInspectionMasterModel {
    _id?: string;
    partnerId : string | IPartner;
    productId: string | IProduct;
    parentId: string | IRiskInspectionMasterModel;
    isHeading: boolean;
    riskTypeOrValue: string;
    discount: number
    taskStatus: AllowedTaskStatus;
    failedMessage: string;
    isActive: boolean;
    parameterCode : string;
}