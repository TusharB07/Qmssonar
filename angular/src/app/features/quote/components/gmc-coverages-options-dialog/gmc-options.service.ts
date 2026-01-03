import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from 'src/app/features/account/account.service';
import { IGMCTemplate } from 'src/app/features/admin/gmc-master/gmc-master-model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { IQuoteGmcOptions } from './gmc-coverage-options.model';
import { stringify } from 'query-string';
import { Observable } from 'rxjs';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { IQuoteGmcTemplate, IQuoteOption, QuoteGmcTemplate } from 'src/app/features/admin/quote/quote.model';

@Injectable({
  providedIn: 'root'
})
export class GmcOptionsService extends CrudService<IQuoteGmcTemplate> {
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/gmctemplate`, http, accountService, { populate: ["id", "quoteId"] });
  }


  // To Get/Read Single Records from the DB
  getAllOptions(id: string, queryParams?: any): Observable<IOneResponseDto<QuoteGmcTemplate[]>> {
    return this.http.get<IOneResponseDto<QuoteGmcTemplate[]>>(`${this.baseUrl}/getQuoteGmcOptionss/${id}`, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

 
}