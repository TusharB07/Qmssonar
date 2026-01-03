import { IQuoteSlip } from "src/app/features/admin/quote/quote.model";

export interface IDeductible {
    _id: string;
    quoteId: string;
    quoteOptionId: string;
    locationWiseSumInsured: string;
    locationWiseSumInsuredHeader: string;
    claimAmountMin: number;
    claimAmountHeader: string;
    policyType: string;
    productHeader: string;
    productValue: string;
    claimPercentage1: string;
}