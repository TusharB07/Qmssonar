import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from 'src/app/features/account/account.service';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiabilityAddonServiceService extends CrudService<true> {
  constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/quote-location-addon-covers`, http, accountService, { populate: ["quoteId", "productId", "addOnCoverId"] });
   }
}
