import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IManyResponseDto } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService extends CrudService<any>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/emails`, http, accountService);
   }

  getAllEmailHistory(){
    return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}`,{
      headers: this.accountService.bearerTokenHeader()
    })
  }
}
