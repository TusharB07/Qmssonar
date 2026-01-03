import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IRiskManagementFeatures } from './risk-management-features.model';

@Injectable({
  providedIn: 'root'
})
export class RiskManagementFeaturesService extends CrudService<IRiskManagementFeatures> {


  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/riskManagementFeatures`, http, accountService, { populate : ['productId'] });
  }
  // Old_Quote
  saveQuoteRMFeatures(record): Observable<IOneResponseDto<IRiskManagementFeatures>> {
    return this.http.post<IOneResponseDto<IRiskManagementFeatures>>(`${this.baseUrl}/quote-riskManagementFeatures`, record, { headers: this.accountService.bearerTokenHeader() });
  }

  // New_Quote_Option
  saveQuoteOptionRMFeatures(record): Observable<IOneResponseDto<IRiskManagementFeatures>> {
    return this.http.post<IOneResponseDto<IRiskManagementFeatures>>(`${this.baseUrl}/quoteOption-riskManagementFeatures`, record, { headers: this.accountService.bearerTokenHeader() });
  }
}
