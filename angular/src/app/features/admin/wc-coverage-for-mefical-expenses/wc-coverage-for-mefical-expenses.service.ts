import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IWCCoverageForMedicalExpenses } from './wc-coverage-for-mefical-expenses.model';

@Injectable({
  providedIn: 'root'
})
export class WCCoverageForMedicalExpensesService extends CrudService<IWCCoverageForMedicalExpenses> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/wcCoverageForMedicalExpenses`, http, accountService,{ populate: [ 'productId', 'partnerId'] })
  }

//   checkUniqueName(payload){
//     return this.http.post(`${this.baseUrl}/checkunique`, payload, {
//         headers: this.accountService.bearerTokenHeader(),
//       });
// }
}
