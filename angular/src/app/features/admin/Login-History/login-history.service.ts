import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IManyResponseDto } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class LoginHistoryService extends CrudService<any> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) {
    super(`${environment.apiUrl}/loginHistory`, http, accountService, { populate: ['productId partnerId userId'] })
  }

  getLoginHistoryData(){
    return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/`, { headers: this.accountService.bearerTokenHeader() });
  }
}
