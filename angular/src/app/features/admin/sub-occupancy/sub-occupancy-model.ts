import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IOccupancyRate } from "../occupancy-rate/occupancy-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";

export interface ISubOccupancy {
    _id?: string;
    shopName: string;
    terrorismRate: number;
    stfiRate: number;
    minRateUpTo3Months: number;
    ratePerMonthBeyond3Months: number;
    earthquakeRates: number;
    occupancyId:string | IOccupancyRate;
    productId: string | IProduct;
    identity: string;
    partnerId : string | IPartner;
    taskStatus: AllowedTaskStatus;
    failedMessage: string;
    opt1Rate:number;
    opt2Rate:number;
    opt3Rate:number;
    opt4Rate:number;
  }