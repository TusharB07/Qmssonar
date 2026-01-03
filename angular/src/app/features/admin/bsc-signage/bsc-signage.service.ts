import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IBscSignage } from './bsc-signage.model';

@Injectable({
  providedIn: 'root'
})
export class BscSignageService extends CrudService<any> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/bsc-signage-cover`, http, accountService,{ populate: ["quoteId",  'signageTypeId'] });
  }

  deleteFilePath(payload) {
    return this.http.post(`${this.baseUrl}/delete-individual-bsc-cover-file`,payload, {
        headers: this.accountService.bearerTokenHeader(),
    });
  }

}
