import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IQuoteSlip } from '../quote/quote.model';

@Injectable({
  providedIn: 'root'
})
export class OtpService extends CrudService<IQuoteSlip>{


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}`, http, accountService,);

  }

//   generateOtp(){
//     return this
//     .http.get(`${this.baseUrl}/generateOtp/`)
//   }


    otpGenerate(id): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.post<IOneResponseDto<IQuoteSlip>>(`/generateOtp`, {}, { headers: this.accountService.bearerTokenHeader() });
    }
}
