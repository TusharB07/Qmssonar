import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { AccountService } from 'src/app/features/account/account.service';
import { environment } from 'src/environments/environment';
import { IBSCFidelityGurantee } from './bsc-fidelity-gurantee.model';

@Injectable({
  providedIn: 'root'
})
export class BscFidelityGuranteeService extends CrudService<any>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/bsc-fidelity-guarantee-cover`, http, accountService, { populate: ["quoteId",  'riskTypeId'] });
  }

  deleteFilePath(payload) {
    return this.http.post(`${this.baseUrl}/delete-individual-bsc-cover-file`,payload, {
        headers: this.accountService.bearerTokenHeader(),
    });
}


}
