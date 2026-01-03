import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Observable } from "rxjs";
import { IOneResponseDto, IManyResponseDto } from "src/app/app.model";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { ICountry } from "./country.model";

@Injectable({
  providedIn: "root"
})
export class CountryService extends CrudService<ICountry> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
      super(`${environment.apiUrl}/countries`, http, accountService);
  }

}
