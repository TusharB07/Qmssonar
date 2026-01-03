import { IClientLocation } from "../client-location/client-location.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBscFireLossOfProfitCover {
    _id?: string;
    grossProfit: number;
    indmenityPeriod: string;
    terrorism: Boolean;
    auditorsFees: Number;
    // clientLocationId: string | IClientLocation;
    quoteId: string | IQuoteSlip;
    total: number;
    filePath?: string
    isNonOtc? : boolean
}
