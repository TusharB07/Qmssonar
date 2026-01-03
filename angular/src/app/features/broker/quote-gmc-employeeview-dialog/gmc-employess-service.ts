import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IQuoteEmployeeData } from '../../admin/quote/quote.model';
import { CrudService } from '../../service/crud.service';

@Injectable({
  providedIn: 'root'
})
//export class GmcMasterService extends CrudService<IGmcDataModel>{
  export class GmEmloyeesService extends CrudService<IQuoteEmployeeData>{
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/gmcemployees`, http, accountService, { populate: ['id'] });
  }
}