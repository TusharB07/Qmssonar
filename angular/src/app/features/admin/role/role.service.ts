import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IRole } from './role.model';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends CrudService<IRole> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
      super(`${environment.apiUrl}/role`, http, accountService);
  }
}
