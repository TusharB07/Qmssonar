import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../service/crud.service';
import { ICoInsurer } from './co-insurer.model';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class CoInsurersService extends CrudService<ICoInsurer> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/divisionMaster`, http, accountService)
  }
}
