import { AllowedTaskStatus } from "../earthquake-rate/earthquake-rate.model";
import { IHazardCategory } from "../hazard-category/hazard-category.model";
import { IIndustryType } from "../industry-type/industry-type.model";
import { IPartner } from "../partner/partner.model";
import { IProduct } from "../product/product.model";
import { ISector } from "../sector/sector.model";

export interface IOccupancyRate {
  _id?: string;
  occupancyType: string;
  hazardCategoryId: string | IHazardCategory;
  gradedRetention: boolean;
  tacCode: string;
  flexaiib: number;
  stfiRate: number;
  section: string;
  riskCode: number;
  rateCode: number;
  policyType: string;
  specialRemark: string;
  specialExcessGIC: string;
  iibOccupancyCode: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  productId: string | IProduct;
  applicableFrom: Date;
  applicableTo: Date;
  industryTypeId : string | IIndustryType
  taskStatus: AllowedTaskStatus;
  failedMessage?: string;
  partnerId: string | IPartner;
  flexaiibc: number;
  maxnumberOfYears?:number;
  minnumberOfYears?:number;
  maxStockSI?:number;
  active?:boolean;
  tenurewisestfiRate?:number;
  tenurewiseflexaiibc?:number;
  tenurewiseflexaiib?:number;
  buildingFlexaiib:number;
  buildingStfiRate:number;
  buildingFlexaiibc:number;
  buildingTenurewiseflexaiib:number;
  buildingTenurewisestfiRate:number;
  buildingTenurewiseflexaiibc:number;
  contentFlexaiib:number;
  contentStfiRate:number;
  contentFlexaiibc:number;
  contentTenurewiseFlexaiib:number;
  contentTenurewiseStfiRate:number;
  contentTenurewiseFlexaiibc:number;
  sectorId: string | ISector;
  opt1Rate:number,
  opt2Rate:number,
  opt3Rate:number,
  opt4Rate:number,
}

export interface ISubOccupancy {
  _id?: string;
  shopName: string;
  occupancyId:string | IOccupancyRate;
  productId: string | IProduct;
  identity: String;
  partnerId : string | IPartner
  taskStatus: AllowedTaskStatus;
  failedMessage: string;
}

