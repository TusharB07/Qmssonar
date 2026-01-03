import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IThirdPartyAdministrators } from './thirdPartyAdministrators.model';

@Injectable({
  providedIn: 'root'
})
export class ThirdPartyAdministratorsService extends CrudService<IThirdPartyAdministrators> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/tpa`, http, accountService)
  }
}
