import { IQuoteSlip } from "../quote/quote.model";

export interface ILossOfRent {
    _id: string,
    quoteId: string | IQuoteSlip;
    sumInsured: number;
    numberOfMonth: String;
    total: number;

}
