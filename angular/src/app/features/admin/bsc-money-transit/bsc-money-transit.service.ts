import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { AccountService } from 'src/app/features/account/account.service';
import { environment } from 'src/environments/environment';
import { IBscMoneyTransitCover } from './bsc-money-transit.model';

@Injectable({
  providedIn: 'root'
})
export class BscMoneyTransitService extends CrudService<any> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/bsc-money-transit-cover`, http, accountService, { populate: ["quoteId"] });
  }

  deleteFilePath(payload) {
    return this.http.post(`${this.baseUrl}/delete-individual-bsc-cover-file`,payload, {
        headers: this.accountService.bearerTokenHeader(),
    });
}
}
