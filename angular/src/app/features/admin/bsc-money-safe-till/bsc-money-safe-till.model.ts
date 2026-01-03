import { IClientLocation } from "../client-location/client-location.model";
import { IOccupancyRate } from "../occupancy-rate/occupancy-rate.model";
import { IQuoteLocationOccupancy } from "../quote-location-occupancy/quote-location-occupancy.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBscMoneySafeTillCover {
  _id: string,
  locationId: string;
  occupancyId: string | IOccupancyRate;
  moneySafe: number;
  moneyTillCounter: number;
  total: number;
//   clientLocationId: string | IClientLocation;
  quoteLocationOccupancyId: string | IQuoteLocationOccupancy;
  quoteId: string | IQuoteSlip;
  isNonOtc?: boolean;
  filePath?: string
}
