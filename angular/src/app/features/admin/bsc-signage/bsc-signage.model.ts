import { IBscSignageType } from "../bsc-signage-type/bsc-signage-type.model";
import { IClientLocation } from "../client-location/client-location.model";
import { IListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBscSignage {
  _id?: string;
  signageTypeId: string | IListOfValueMaster;
  signageDescription: string;
  sumInsured: number;
  total: Number;
//   clientLocationId: string | IClientLocation;
  quoteId: string | IQuoteSlip;
  isNonOtc? : boolean;
  filePath?: string;
  nstp:number;
}

export interface IBscPedalCycle {
  _id?: string;
  riskTypeId: string | IListOfValueMaster;
  riskDescription: string;
  sumInsured: number;
  total: Number;
//   clientLocationId: string | IClientLocation;
  quoteId: string | IQuoteSlip;
  isNonOtc? : boolean;
  filePath?: string;
  nstp:number;
}

