import { IQuoteGmcTemplate, IQuoteSlip } from "src/app/features/admin/quote/quote.model"

export class ComparasionwithBrokerModel {
    optionComparasionModel: ComparasionModel[] = [];
    brokerData: IQuoteGmcTemplate[] = []
}
export class ComparasionModel {
    optionName: string = ""
    icOptions: IcOptions[] = []
}
export class IcOptionsList {
    icOptionsLst: IcOptions[] = [];
}

export class IcOptions {
    insuranceCompQuote: IQuoteSlip;
    optionsLst: IQuoteGmcTemplate[] = [];
}

export class QCRQuestionAnswer {
    question: string = ""
    answer: QcrAnswers[] = []
    isHeader: boolean = false
    isSubHeader: boolean = false
    isLabel: boolean = false
    colspan: number = 1
    tempId: string = ""
    subtabId: number = 0
    gmcLabelForSubTabId: number = 0
    questId: number = 0
    quoteId: string | IQuoteSlip;
    parentTabName: string
    freeTextValue: string;
    optionIndex: number = 0
    isActive: boolean;
    bankName: string = ""
}


export class QcrAnswers {
    id: number = 0
    answer: any[] = []
    icType: string = ""
    optionIndex: number = 0;
    quoteId: string | IQuoteSlip;
    freeTextValue: string;
    isChanged: boolean = false
    showEmpty: boolean = false
}


export class QcrHeaders {
    label: string = ""
    colspan: number = 1
    quoteId: string | IQuoteSlip;
    quoteFor: string = ""
    showButton: boolean = true
    indicativePremium: number = 0
    optionId: string;
    optionIndex: number = 0
    bankName: string = ""
}