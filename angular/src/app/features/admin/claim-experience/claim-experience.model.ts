// import { Schema } from "inspector

import { IQuoteSlip } from "../quote/quote.model";

export interface IClaimExperience {
    _id?: string;
    quoteId:string | IQuoteSlip;
    year: number;
    premiumPaid: number;
    claimAmount: number;
    numberOfClaims: number;
    natureOfClaim: string;

}
