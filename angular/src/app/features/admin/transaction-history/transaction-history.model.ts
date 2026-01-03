import { IPartner } from "../partner/partner.model";
import { IQuoteSlip } from "../quote/quote.model";

export enum Status {
    SUCCESS = 'success',
    FAIL = 'fail'
}

export interface ITransactionHistory {
    partnerId: string | IPartner;
    transaction_Date : Date;
    transaction_No : string;
    quoteId : string | IQuoteSlip ;
    status : string | Status
}