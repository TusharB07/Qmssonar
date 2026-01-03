import { IClientLocation } from "../client-location/client-location.model";
import { IListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { IOccupancyRate, ISubOccupancy } from "../occupancy-rate/occupancy-rate.model";
import { IPincode } from "../pincode/pincode.model";
import { IQuoteOption, IQuoteSlip } from "../quote/quote.model";
import { IState } from "../state/state.model";

export interface DescriptionImage {
    imagePath: string,
    description?: string,
    riskInspectionReportFromAI: RiskInspectionReport;
}


interface Parameter {
  name: string;
  value: number;
  justification: string;
}

interface RiskInspectionReport {
  overall_rating: number;
  parameters: Parameter[];
}
export interface IQuoteLocationOccupancy {
  _id?: string;
  clientLocationId: string | IClientLocation;
  occupancyId: string | IOccupancyRate;
  occupancySubTypeId?: string | ISubOccupancy;
  pincodeId?: string | IPincode;
  locationName?: string;
  quoteId: string | IQuoteSlip;
  sumAssured: number;
  flexaPremium: number;
  STFIPremium: number;
  earthquakePremium: number;
  terrorismPremium: number;
  totalPremium: number;

  isFlexa: boolean;
  isStfi?: boolean;
  isEarthquake?: boolean;
  isTerrorism?: boolean;

  ageOfBuilding?: string;
  constructionType?: string;
  yearLossHistory?: string;
  fireProtection?: string;
  amcFireProtection?: string;
  distanceBetweenFireBrigade?: String;
  riskCovered?: string;
  premises?: string;

  riskInspectionReportDocumentPath?: string

  locationPhotographs?: DescriptionImage[]
  typeOfShopDescription?: string;
  riskInspectionReport?: {};
  totalDiscount?: number;
  totalPremiumWithDiscount?: number;
  commercialLoadingDiscount?: number;
  riskInspectionDiscount?: number;
  // New_Quote_Option
  quoteOptionId?: string | IQuoteOption;
}
