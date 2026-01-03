import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { LazyLoadEvent } from 'primeng/api';
import { EmailTemplate } from './emailtemplate.model';
@Injectable({
  providedIn: 'root'
})


export class EmailConfigurationService extends CrudService<EmailTemplate>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/emailTemplates`, http, accountService);
   }

   getAllEmailConfiguration(){
    return this.http.get<IManyResponseDto<EmailTemplate>>(`${this.baseUrl}/`,{
      headers: this.accountService.bearerTokenHeader()
    })
   }

   getEmailConfiguration(id){
    return this.http.get<IOneResponseDto<EmailTemplate>>(`${this.baseUrl}/${id}`,{
      headers: this.accountService.bearerTokenHeader()
    })
   }

   createEmailConfiguration(payload){
    return this.http.post<IOneResponseDto<EmailTemplate>>(`${this.baseUrl}`,payload,{
      headers: this.accountService.bearerTokenHeader()
    })
   }
}
