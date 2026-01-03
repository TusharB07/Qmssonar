import { IBscAccompaniedBaggageType } from "../bsc-accompanied-baggage-type/bsc-accompanied-baggage-type.model";
import { IClientLocation } from "../client-location/client-location.model";
import { IListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { IQuoteLocationOccupancy } from "../quote-location-occupancy/quote-location-occupancy.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBscAccompaniedBaggage {
    _id?: string;
    baggageTypeId: string | IListOfValueMaster;
    baggageDescription: string;
    sumInsured: number;
    total: number;
    // clientLocationId: string | IClientLocation;
    quoteLocationOccupancyId: string | IQuoteLocationOccupancy;
    quoteId: string | IQuoteSlip;
    isNonOtc? : boolean;
    filePath?: string;
    nstp:number;
  }
