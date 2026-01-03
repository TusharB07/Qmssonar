import { IQuoteSlip } from "../quote/quote.model";

export interface IValuableContentsOnAgreedValue {
    _id : string,
    quoteId:string | IQuoteSlip;
    itemDescription: string;
    sumInsured: Number;
    total: number;
    valuablecontentsonagreedvalues : any;
    valuationCertification: any;
}
