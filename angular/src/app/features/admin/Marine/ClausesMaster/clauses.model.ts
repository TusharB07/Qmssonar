import { ILov } from "src/app/app.model";
import { IClausesHeads } from "../ClausesHeadsMaster/clausesHeads.model";
import { IInterest } from "../InterestMaster/interest.model";

export interface IClauses {
    _id?: string;
    clauseName:string;
    headId: string | IClausesHeads;
    transitTypes: ILov[];
    interests: ILov[];
    packagings: ILov[];
    conveyances: ILov[];
    isActive: boolean;
    isClauseSelected:boolean;
    selectedDescription:string;
}