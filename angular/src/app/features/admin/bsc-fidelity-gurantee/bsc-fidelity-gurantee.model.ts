import { IBscFidelityGuranteeRiskType } from "../bsc-fidelity-gurantee-risk-type/bsc-fidelity-gurantee-risk-type.model";
import { IClientLocation } from "../client-location/client-location.model";
import { IListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBSCFidelityGurantee {
  _id?: string;
  riskTypeId: string | IListOfValueMaster;
  riskDescription: string;
  sumInsured: number;
  total: Number;
  quoteId: string | IQuoteSlip;
  employeearray?: IBscFidelityEmployee[]
  noOfEmployee: number
  isNonOtc?: boolean;
  perEmployeeSumInsured?: Number;
  filePath?: string;
}

export interface IBscFidelityEmployee {
  employee: string;
  sumInsured: number;
}
