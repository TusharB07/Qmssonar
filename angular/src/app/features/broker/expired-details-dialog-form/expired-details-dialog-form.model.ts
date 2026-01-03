import { IQuoteOption, IQuoteSlip } from "src/app/features/admin/quote/quote.model";
import { IProduct } from "../../admin/product/product.model";

export interface IExpiredDetails {
    _id?: string;
    quoteId: string | IQuoteSlip;
    quoteOptionId: string | IQuoteOption;
    expiringIsurenceName: string;
    expiringIsurenceOffice: string;
    expiringPolicyNumber: string;
    expiringPolicyPeriod: string;

}
