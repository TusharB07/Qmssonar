import { Injectable } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { IBscClauses } from './dynamic-clauses.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicClausesService extends CrudService<any> {

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/bscClauses`, http, accountService,{ populate: ["productId","partnerId"] });
   }

   getALlClauses(payload){
    return this.http.post(`${this.baseUrl}/getSelectedBscClausDescription`, payload,{
      headers: this.accountService.bearerTokenHeader()
    });
   }

}
