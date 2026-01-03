import { IGMCTemplate } from "src/app/features/admin/gmc-master/gmc-master-model"
import { EmployeeDemographic, IQuoteGmcTemplate } from "src/app/features/admin/quote/quote.model"

export interface IGmcCoverageOptions {
    optionName: string
    options: string[]
    selectedOption: string
    isSelected: boolean
    copiedFrom:string
    gmcTemplateData:IGMCTemplate[]
    employeeDeographic: EmployeeDemographic
}

export class GmcCoverageOptions {
    optionName: string
    options: string[]=[]
    selectedOption: string
    isSelected: boolean
    copiedFrom:string
    gmcTemplateData:IGMCTemplate[]
    employeeDeographic: EmployeeDemographic
    
}

export interface IQuoteGmcOptions {
    quoteId: string;
    gmcCoverageOptions: GmcCoverageOptions
}

