import { IClientLocation } from "../client-location/client-location.model";
import { IListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { IQuoteLocationOccupancy } from "../quote-location-occupancy/quote-location-occupancy.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBscBurglaryHousebreakingCover {
  _id?: string;
  locationId: string;
  firstLoss: number;
  stocks: number;
  otherContents: number;
  firstLossSumInsured: number;
  rsmd: Boolean;
  theft: Boolean;
  total: number;
  burglaryTypeId : string | any;
  isFirstLossOpted?: boolean;
  //   clientLocationId: string | IClientLocation;
  quoteLocationOccupancyId: string | IQuoteLocationOccupancy;
  quoteId: string | IQuoteSlip;
  isNonOtc?: boolean;
  filePath?: string
}
