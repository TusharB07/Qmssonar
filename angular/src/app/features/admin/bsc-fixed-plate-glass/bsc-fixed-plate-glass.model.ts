import { IClientLocation } from "../client-location/client-location.model";
import { IListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { IQuoteLocationOccupancy } from "../quote-location-occupancy/quote-location-occupancy.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBscFixedPlateGlassCover {
    // locationId: Schema.Types.ObjectId;
    _id?: string;
    plateGlassType: string | IListOfValueMaster;
    description: string;
    sumInsured: number;
    total: number;
    quoteLocationOccupancyId: string | IQuoteLocationOccupancy;
    // clientLocationId: string | IClientLocation;
    quoteId: string | IQuoteSlip;
    ratePerMile: Number;
    isNonOtc?: boolean;
    filePath?: string
  }
