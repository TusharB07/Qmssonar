import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IBscFireLossOfProfitCover } from './bsc-fire-loss-of-profit.model';

@Injectable({
  providedIn: 'root'
})
export class BscFireLossOfProfitService extends CrudService<any> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/bsc-fireLossOfProfit-cover`, http, accountService,  { populate: ["quoteId"] });
  }

  deleteFilePath(payload) {
    return this.http.post(`${this.baseUrl}/delete-individual-bsc-cover-file`,payload, {
        headers: this.accountService.bearerTokenHeader(),
    });
}
}
