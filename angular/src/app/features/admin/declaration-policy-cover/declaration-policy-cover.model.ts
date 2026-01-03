// import { Schema } from "inspector";
import { IQuoteSlip } from "../quote/quote.model";

export interface IDeclarationPolicy {
    _id : string,
    quoteId: string | IQuoteSlip;
    sumInsured: number;
    stock: String;
    total: number;
}
