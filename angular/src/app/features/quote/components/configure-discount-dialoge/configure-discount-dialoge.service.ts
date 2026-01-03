import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { IQuoteDiscount } from './configure-discount-dialoge.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigureDiscountDialogeService extends CrudService <IQuoteDiscount>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/quoteDiscounts`, http, accountService, { populate: ["quoteId" , "discountId" , "discountedAmount"] });
}

getQuoteDiscounts(payload): Observable<IOneResponseDto<any>>{
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/getQuoteDiscounts`, payload, { headers: this.accountService.bearerTokenHeader() });
    }
// getQuoteDiscounts(id){
//         return this.http.get(`${this.baseUrl}/getQuoteDiscounts${id}`,  { headers: this.accountService.bearerTokenHeader() });
//     }
  }
