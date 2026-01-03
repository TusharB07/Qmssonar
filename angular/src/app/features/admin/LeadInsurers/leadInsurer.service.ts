import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { ILeadInsurers } from './leadInsurer.model';

@Injectable({
  providedIn: 'root'
})
export class LeadInsurersService extends CrudService<ILeadInsurers> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/leadInsurers`, http, accountService)
  }
}
