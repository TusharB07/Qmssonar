import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { AccountService } from 'src/app/features/account/account.service';
import { environment } from 'src/environments/environment';
import { IBscLiability } from './bsc-liability.model';

@Injectable({
  providedIn: 'root'
})
export class BscLiabilityService extends CrudService<any>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/bsc-liability-section-cover`, http, accountService, { populate: ["quoteId", 'riskTypeId'] });
  }

  deleteFilePath(payload) {
    return this.http.post(`${this.baseUrl}/delete-individual-bsc-cover-file`,payload, {
        headers: this.accountService.bearerTokenHeader(),
    });
}
}
