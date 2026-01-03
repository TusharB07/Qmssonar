import { IBscPortableEquipmentType } from "../bsc-portable-equipment-type/bsc-portable-equipment-type.model";
import { IClientLocation } from "../client-location/client-location.model";
import { IListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBscPortableEquipments {
    _id?: string;
    //   equipmentType: string;
    equipmentTypeId: string | IListOfValueMaster;
    equipmentDescription: string;
    geography: string;
    sumInsured: number;
    total: number;
    // clientLocationId: string | IClientLocation;
    quoteId: string | IQuoteSlip;
    filePath?: string;
    isNonOtc?: boolean;
    nstp:number;
}


export interface IBscAllRisks {
    _id?: string;
    //   equipmentType: string;
    riskTypeId: string | IListOfValueMaster;
    riskDescription: string;
    // geography: string;
    sumInsured: number;
    total: number;
    // clientLocationId: string | IClientLocation;
    quoteId: string | IQuoteSlip;
    filePath?: string;
    isNonOtc?: boolean;
    nstp:number;
}


