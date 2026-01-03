import { Injectable } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { IApiHistory } from './api-history.model';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiHistoryService extends CrudService<IApiHistory> {

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/apiHistory`, http, accountService, { populate: ['quoteId partnerId'] });
  }
}
