import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { GmcFileTemplate } from './gmc-file-template.model';

@Injectable({
  providedIn: 'root'
})
export class GmcFileTemplateService  extends CrudService<GmcFileTemplate> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/gmcFileTemplateSetting`, http, accountService)
  }
}
