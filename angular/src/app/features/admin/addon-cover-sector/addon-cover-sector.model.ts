import { IAddOnCover } from "../addon-cover/addon-cover.model";
import { ISector } from "../sector/sector.model";

export interface IAddOnCoverSector {
  _id?: string;
  addOnCoverId: string | IAddOnCover;
  sectorId: string | ISector;
  isApplicable: boolean;
  status: boolean;
}
