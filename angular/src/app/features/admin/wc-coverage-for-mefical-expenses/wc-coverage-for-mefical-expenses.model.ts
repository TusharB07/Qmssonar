import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface IWCCoverageForMedicalExpenses {
    _id?: string;
    productId: string | IProduct;
    limitPerEmployee: number;
    netPremiumPerEmployee: number;
    active: boolean;
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    partnerId: string | IPartner }