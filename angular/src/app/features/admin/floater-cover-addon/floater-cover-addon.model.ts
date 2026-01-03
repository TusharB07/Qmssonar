
import { IQuoteLocationOccupancy } from "../quote-location-occupancy/quote-location-occupancy.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IFloaterCoverAddOn {
    _id : string,
    quoteId: string | IQuoteSlip;
    quoteLocationOccupancyId: string | IQuoteLocationOccupancy;
    whetherStockStoredInOpen: String;
    stockValue: String;
    sumInsured: Number;
    total: number;
}
