import { IQuoteOption, IQuoteSlip } from "../../admin/quote/quote.model";

export interface IProject {
    _id:string;
    quoteId: string | IQuoteSlip;
    quoteOptionId: string | IQuoteOption;
    wetRiskInvolved: Boolean;
    isbrownfieldProject: Boolean;
    principalName: String;
    principalAddress: String;
    contractorName: String;
    contractorAddress: String;
    subContractorName: String;
    subContractorAddress: String;
    nameofProject: String;
    projectLocation: String;
    projectDescription: String;
    projectPeriodStart: Date;
    projectPeriodEnd: Date;
    testingPeriod:string;
  }