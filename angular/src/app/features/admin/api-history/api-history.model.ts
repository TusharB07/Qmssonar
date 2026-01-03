import { IPartner } from "../partner/partner.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IApiHistory {
    _id?: string;
    apiName: string,
    apiUrl: string,
    payload: string
    response: string,
    status: string,
    startTime: Date,
    endTime: Date,
    quoteId: string | IQuoteSlip,
    partnerId: string | IPartner,
    insurerpartnerId: string | IPartner
}

export enum apiNameOption {
    CREATE_CLIENT = "create client",
    CREATE_BLUS_PRODUCT = "create blus product",
}
export enum statusOption {
    SUCCESS = "success",
    FAILED = "failed",
}
