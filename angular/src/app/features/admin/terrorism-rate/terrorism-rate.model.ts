import { IOccupancyRate } from './../occupancy-rate/occupancy-rate.model';
import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IIndustryType } from "../industry-type/industry-type.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";
import { ISector } from '../sector/sector.model';

export interface ITerrorismRate {
    _id?: string;
    industryTypeId: string | IIndustryType;
    fromSI: number;
    toSI: number;
    ratePerMile: number;
    addValue: number;
    remark: string;
    productId: string | IProduct;
    applicableTo: Date;
    applicableFrom: Date;
    taskStatus: AllowedTaskStatus;
    failedMessage?: string;
    partnerId: string | IPartner;
    occupancyId: string | IOccupancyRate,
    bulidingRatePerMile:number;
    contentRatePerMile:number;
    sectorId: string | ISector;
}
