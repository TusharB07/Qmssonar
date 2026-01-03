
import { IQuoteSlip } from "../quote/quote.model";

export interface IFireFloaterCoverAddOn {
    _id: string,
    quoteId: string | IQuoteSlip;
    sumInsured: number;
    ratePerMile: Number;
    total: number;

    isChecked: boolean;
}
