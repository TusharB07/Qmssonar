import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IBscLiabilitySectionRiskType } from './bsc-liability-section-risk-type.model';

@Injectable({
  providedIn: 'root'
})
export class BscLiabilitySectionRiskTypeService extends CrudService<IBscLiabilitySectionRiskType>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
      super(`${environment.apiUrl}/bsc-liability-section-type`, http, accountService, { populate: [""] });
  }
}
