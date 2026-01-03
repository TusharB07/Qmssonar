import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { IDeductible } from './deductibles.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { AccountService } from 'src/app/features/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class DeductibleExcessService  extends CrudService<IDeductible>{
  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/excessDeductibles`, http, accountService, { populate: ['quoteId'] })
  }

  getDeductibletable(event: LazyLoadEvent): Observable<IManyResponseDto<IDeductible>> {
    const payload = { ...event };
    // payload["populate"] = this.options?.populate;

    return this.http.post<IManyResponseDto<IDeductible>>(`${this.baseUrl}/prime`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  createDeductibletable(payload): Observable<IManyResponseDto<IDeductible>> {
    return this.http.post<IManyResponseDto<IDeductible>>(`${this.baseUrl}`,payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  createManyDeductibletable(payload): Observable<IManyResponseDto<IDeductible>> {
    return this.http.post<IManyResponseDto<IDeductible>>(`${this.baseUrl}/insert-many`,payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }
  
}
