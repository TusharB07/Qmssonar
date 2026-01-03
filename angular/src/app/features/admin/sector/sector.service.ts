import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { ISector } from "./sector.model";

@Injectable({
  providedIn: "root"
})
export class SectorService extends CrudService<ISector> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/sector-masters`, http, accountService);
  }
}
