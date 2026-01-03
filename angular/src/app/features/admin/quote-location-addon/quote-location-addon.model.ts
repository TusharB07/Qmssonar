import { IAddOnCover } from "../addon-cover/addon-cover.model";
import { IClientLocation } from "../client-location/client-location.model";
import { IQuoteSlip } from "../quote/quote.model";

export interface IQuoteLocationAddonCovers {
    _id?: string;
    quoteId: string | IQuoteSlip;
    locationId: string | IClientLocation;
    addOnCoverId: string | IAddOnCover;
}
