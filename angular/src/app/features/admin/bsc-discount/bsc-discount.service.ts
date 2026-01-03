import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Observable } from "rxjs";
import { IManyResponseDto, IOneResponseDto } from "src/app/app.model";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { IBscDiscount } from "./bsc-discount.model";

@Injectable({
  providedIn: "root"
})
export class BscDiscountService extends CrudService<IBscDiscount> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/bsc-discount-cover`, http, accountService, { populate: ["productId"] });
  }
}
