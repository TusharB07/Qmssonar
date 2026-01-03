import { IListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBscWorkmenCompensation {
    _id?: string;
  riskTypeId: string | IListOfValueMaster;
  riskDescription?: string;
  sumInsured: number;
  total?: Number;
  quoteId: string | IQuoteSlip;
  noOfEmployee?: number;
  averageSalaryOfEmployee?: number;
  isNonOtc?: boolean;
  perEmployeeSumInsured?: number;
  filePath?: string;
}