import { EandOTemplate } from "src/app/features/admin/quote/quote.model"

export interface ILiabilityCoveragesOptions {
    optionName: string
    options: string[]
    selectedOption: string
    isSelected: boolean
    copiedFrom:string
    templateData:any[]    
}

export class LiabilityCoveragesOptions {
    optionName: string
    options: string[]=[]
    selectedOption: string
    isSelected: boolean
    copiedFrom:string
    templateData:any[]   
}

export interface IQuoteLiabilityOptions {
    quoteId: string;
   eandoCoverageOptions: LiabilityCoveragesOptions
}