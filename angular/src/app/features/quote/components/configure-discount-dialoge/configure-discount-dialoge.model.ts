import { IQuoteOption, IQuoteSlip } from "src/app/features/admin/quote/quote.model";

export interface IQuoteDiscount {
    _id?: string;
    quoteId: string | IQuoteSlip;
    discountFrom: number;
    discountTo: number;
    totalIndictiveQuoteAmt: number;
    discountedAmount: number;
    discountPercentage: number;
    afterDiscountAmount: number;
    quoteOptionId: string | IQuoteOption;


}
