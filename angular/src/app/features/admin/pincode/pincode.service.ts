import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Observable } from "rxjs";
import { IManyResponseDto, IOneResponseDto } from "src/app/app.model";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { IPincode } from "./pincode.model";

@Injectable({
  providedIn: "root"
})
export class PincodeService extends CrudService<IPincode> {
  // baseUrl = `${environment.apiUrl}/pincodes`;

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/pincodes`, http, accountService, { populate: ["cityId", "districtId", "stateId", "pincodeId", "countryId"] });
  }
}
