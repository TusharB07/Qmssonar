import { IQuoteSlip } from "../quote/quote.model";

export interface IRentForAlternativeAccomodation {
    _id : string,
    quoteId: string | IQuoteSlip;
    sumInsured: number;
    numberOfMonth: String;
    total:number;

}
