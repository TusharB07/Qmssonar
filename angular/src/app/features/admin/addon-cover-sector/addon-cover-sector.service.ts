import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { IAddOnCoverSector } from "./addon-cover-sector.model";

@Injectable({
  providedIn: "root"
})
export class AddonCoverSectorService extends CrudService<IAddOnCoverSector> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/addon-cover-sectors`, http, accountService, { populate: ["addOnCoverId" , "sectorId"] });
  }
}
