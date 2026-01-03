import { IIndustryType } from "../industry-type/industry-type.model";
import { IOccupancyRate } from "../occupancy-rate/occupancy-rate.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";
import { ISector } from "../sector/sector.model";

export enum AllowedTaskStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed"
}
export interface IEarthquakeRate {
  _id?: string;
  // industryTypeId: string | IIndustryType;
  zone: string;
  rate: number;
  tenurewiseRate: number;
  buildingRate:number;
  buildingTenurewiseRate:number;
  contentRate:number;
  contentTenurewiseRate:number;
  productId: string | IProduct;
  applicableFrom: Date;
  applicableTo: Date;
  taskStatus: AllowedTaskStatus;
  failedMessage?: string;
  partnerId: string | IPartner;
  occupancyId : string | IOccupancyRate;
  sectorId: string | ISector;
}
