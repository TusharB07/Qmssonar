import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IQuoteLocationAddonCovers } from './quote-location-addon.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteLocationAddonService extends CrudService<IQuoteLocationAddonCovers> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/quote-location-addon-covers`, http, accountService, { populate: ["quoteId", "locationId", "addOnCoverId"] });
  }

  saveAddons(payload) {
    return this.http.post(`${this.baseUrl}/`, payload, {
      headers: this.accountService.bearerTokenHeader(),
    })
  }
}
