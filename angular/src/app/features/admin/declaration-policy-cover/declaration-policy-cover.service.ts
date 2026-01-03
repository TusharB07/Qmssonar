import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IDeclarationPolicy } from './declaration-policy-cover.model';

@Injectable({
  providedIn: 'root'
})
export class DeclarationPolicyCoverService extends CrudService<IDeclarationPolicy> {
  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/declarationPolicy`, http, accountService, { populate: ['quoteId'] })


  }
}
