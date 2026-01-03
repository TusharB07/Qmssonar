import { IQuoteSlip } from "../quote/quote.model";

export interface IMachineryLossOfProfitCover {
    _id?: string
    grossProfit: number;
    indmenityPeriod: string;
    terrorism: Boolean;
    quoteId: string | IQuoteSlip;
    total: Number;
    ratePerMile: Number;
    originalMachineryLossOfProfitId: string;
}
