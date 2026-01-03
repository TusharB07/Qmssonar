import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IExclusion } from './exclusion.model';

@Injectable({
  providedIn: 'root'
})
export class ExclusionService extends CrudService<IExclusion> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/exclusion`, http, accountService, { populate: [  'partnerId', ' productId'] })
  }

  saveQuoteExclusions(record): Observable<IOneResponseDto<IExclusion>> {
    return this.http.post<IOneResponseDto<IExclusion>>(`${this.baseUrl}/quote-exclusion`, record, { headers: this.accountService.bearerTokenHeader() });
  }

  // New_Quote_option
  saveQuoteOptionExclusions(record): Observable<IOneResponseDto<IExclusion>> {
    return this.http.post<IOneResponseDto<IExclusion>>(`${this.baseUrl}/quoteOption-exclusion`, record, { headers: this.accountService.bearerTokenHeader() });
  }
}
