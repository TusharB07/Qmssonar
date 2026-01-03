import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { IIndustryType } from "./industry-type.model";

@Injectable({
  providedIn: "root"
})
export class IndustryTypeService extends CrudService<IIndustryType> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/industryTypes`, http, accountService);
  }
}
