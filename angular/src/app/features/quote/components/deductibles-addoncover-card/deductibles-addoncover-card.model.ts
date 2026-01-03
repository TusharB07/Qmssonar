import { IQuoteSlip } from "src/app/features/admin/quote/quote.model";

export interface IDeductibleaddoncover {
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
}


export interface IDeductiblesAddoncover {
    isChecked:boolean,
    addOnCoverName:string,
    // coverName:string,
    productValue:string,
    claimPercentage: number,
    claimAmountMin: number,
}
