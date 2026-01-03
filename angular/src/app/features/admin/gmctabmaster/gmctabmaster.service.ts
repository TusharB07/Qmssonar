import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IGMCTemplate } from '../gmc-master/gmc-master-model';

@Injectable({
  providedIn: 'root'
})
export class GmctabmasterService extends CrudService<IGMCTemplate> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/gmcmaster`, http, accountService)
  }
}
