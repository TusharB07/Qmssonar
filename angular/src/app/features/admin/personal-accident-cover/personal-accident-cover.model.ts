import { ILov } from "src/app/app.model";
import { IListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IPersonalAccidentCover {
    _id: string,
    quoteId: string | IQuoteSlip;
    name: string;
    spouseName: String;
    proposerAge: number;
    spouseAge: number;
    total: number;
    sumInsured: number;
    riskTypeId: string | IListOfValueMaster;
    filePath?: string | IPersonalAccidentCoverBS
}

export interface IPersonalAccidentCoverBS {
    _id?: string;
    riskTypeId: string | IListOfValueMaster;
    riskDescription: string;
    sumInsured: number;
    total: Number;
    quoteId: string | IQuoteSlip;
    noOfEmployee?: number;
    isNonOtc?: boolean;
    perEmployeeSumInsured?: number;
    filePath?: string;
    employeeName?: string;
    employeeAge?: string;
    insuredAge?: number;
    nomineeName?: string;
    nomineeRelation?: string;
    name?: string;
    gender?: string;
    occupation?: string;
}

export const OPTIONS_NOMINEE_RELATION: ILov[] = [
    { label: 'Spouse', value: 'SPOU' },
    { label: 'Father', value: 'FATH' },
    { label: 'Mother', value: 'MOTH' },
]

export const OPTIONS_GENDER: ILov[] = [
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
]
