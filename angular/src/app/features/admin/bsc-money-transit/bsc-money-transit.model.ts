import { IClientLocation } from "../client-location/client-location.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBscMoneyTransitCover {
    _id: string,
    transitFrom: string;
    transitTo: string;
    singleCarryingLimit: number;
    annualTurnover: number;
    total: number;
    // clientLocationId: string | IClientLocation;
    quoteId: string | IQuoteSlip;
    isNonOtc?: boolean;
    filePath?: string
}
