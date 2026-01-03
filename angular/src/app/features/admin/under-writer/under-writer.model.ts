import { IOccupancyRate } from "../occupancy-rate/occupancy-rate.model";
import { IProduct } from "../product/product.model";
import { ISector } from "../sector/sector.model";

export interface IUnderWriter {
    _id?: string;
    sectorId: string | ISector;
    occupancyId : string | IOccupancyRate
    zone: string;
    productId: string | IProduct;
    fromSI: number;
    toSI: number;
    underWriter1: boolean;
    underWriter2: boolean;
    underWriter3: boolean;
    underWriter4: boolean;
    underWriter5: boolean;
    underWriter6: boolean;
    underWriter7: boolean;
    underWriter8: boolean;
    underWriter9: boolean;
    underWriter10: boolean;
}