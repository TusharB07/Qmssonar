import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IBscSignageType } from './bsc-signage-type.model';

@Injectable({
  providedIn: 'root'
})
export class BscSignageTypeService extends CrudService<IBscSignageType>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
      super(`${environment.apiUrl}/bsc-signage-type`, http, accountService, { populate: [""] });
  }
}
