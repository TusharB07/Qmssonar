import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { AccountService } from 'src/app/features/account/account.service';
import { IDeductibleaddoncover, IDeductiblesAddoncover } from './deductibles-addoncover-card.model';
@Injectable({
  providedIn: 'root'
})
export class DeductiblesAddoncoverCardService extends CrudService<IDeductiblesAddoncover>{
  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/excessDeductiblesAddOns`, http, accountService, { populate: ['quoteId'] })
  }

  getDeductibleAddoncover(event: LazyLoadEvent): Observable<IManyResponseDto<IDeductiblesAddoncover>> {
    const payload = { ...event };
    payload["populate"] = this.options?.populate;

    return this.http.post<IManyResponseDto<IDeductiblesAddoncover>>(`${this.baseUrl}/prime`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }


}
