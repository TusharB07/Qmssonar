import { IClientLocation } from "../client-location/client-location.model";
import { IListOfValueMaster } from "../list-of-value-master/list-of-value-master.model";
import { IQuoteLocationOccupancy } from "../quote-location-occupancy/quote-location-occupancy.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IBscElectronicEquipmentsCover {
    _id: string,
    locationId: string;
    descriptionEquipments: string;
    sumInsured: number;
    total: number;
    quoteLocationOccupancyId: string | IQuoteLocationOccupancy
    // clientLocationId: string | IClientLocation;
    quoteId: string | IQuoteSlip;
    isNonOtc?: boolean;
    filePath?: string;
    nstp:number;
    equipmentTypeId: string | IListOfValueMaster;
}
