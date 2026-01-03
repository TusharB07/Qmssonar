import { Injectable } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { IPolicyPeriod } from './policy-period.model';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyPeriodService extends CrudService<IPolicyPeriod> {

  constructor(protected http: HttpClient, protected accountService: AccountService ) {
      super(`${environment.apiUrl}/policyPeriodMaster`, http, accountService);
  }
}
