import { IClientLocation } from "../client-location/client-location.model";
import { AllowedLovReferences } from "../list-of-value-master/list-of-value-master.model";
import { IQuoteLocationOccupancy } from "../quote-location-occupancy/quote-location-occupancy.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IQuoteLocaitonBreakupMaster {
    [x: string]: any;
    _id?: string
    lovId: string,
    lovKey: string,
    lovType: string,
    // lovReference?: AllowedLovReferences,
    lovReferences?: AllowedLovReferences[],
    quoteId: string | IQuoteSlip,
    // clientLocationId: string | IClientLocation,
    quoteLocationOccupancyId: string | IQuoteLocationOccupancy,
    value: number | string,
}


export interface IBreakupMap {
    name: string;
    children?: IBreakupMap[];
}
