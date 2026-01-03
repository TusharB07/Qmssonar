import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IBscFidelityGuranteeRiskType } from './bsc-fidelity-gurantee-risk-type.model';

@Injectable({
  providedIn: 'root'
})
export class BscFidelityGuranteeRiskTypeService extends CrudService<IBscFidelityGuranteeRiskType>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
      super(`${environment.apiUrl}/bsc-fidelity-guarantee-type`, http, accountService, { populate: [""] });
  }
}
