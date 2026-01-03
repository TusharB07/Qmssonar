import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { ISubjectivity } from './subjectivity.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectivityService extends CrudService<ISubjectivity> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/subjectivity`, http, accountService, { populate: [  'partnerId', ' productId'] })
  }

  saveQuoteSubjectivities(record): Observable<IOneResponseDto<ISubjectivity>> {
    return this.http.post<IOneResponseDto<ISubjectivity>>(`${this.baseUrl}/quote-subjectivity`, record, { headers: this.accountService.bearerTokenHeader() });
  }

  // New_Quote_option
  saveQuoteOptionSubjectivities(record): Observable<IOneResponseDto<ISubjectivity>> {
    return this.http.post<IOneResponseDto<ISubjectivity>>(`${this.baseUrl}/quoteOption-subjectivity`, record, { headers: this.accountService.bearerTokenHeader() });
  }
}
