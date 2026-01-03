import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IWarranty } from './warranty.model';

@Injectable({
  providedIn: 'root'
})
export class WarrantyService extends CrudService<IWarranty> {

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/warranty`, http, accountService, { populate: ['partnerId', ' productId'] })
  }

  saveQuoteWarrenties(record): Observable<IOneResponseDto<IWarranty>> {
    return this.http.post<IOneResponseDto<IWarranty>>(`${this.baseUrl}/quote-warranties`, record, { headers: this.accountService.bearerTokenHeader() });
  }

  // New_Quote_option
  saveQuoteOptionWarrenties(record): Observable<IOneResponseDto<IWarranty>> {
    return this.http.post<IOneResponseDto<IWarranty>>(`${this.baseUrl}/quoteOption-warranties`, record, { headers: this.accountService.bearerTokenHeader() });
  }
  
}
