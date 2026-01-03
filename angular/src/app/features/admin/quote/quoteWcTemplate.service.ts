import { Injectable } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IWCTemplate } from '../quote/quote.model';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteWcTemplateService extends CrudService<IWCTemplate> {
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/wcdata`, http, accountService, { populate: ['id'] });
  }

  updateWCTemplateForUnderWriter(payload: any) {
    return this.http.post(`${this.baseUrl}/updateWcTemplate`, payload, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  createAndUpdateOption(payload: any) {
    return this.http.post(`${this.baseUrl}/createAndUpdateOption`, payload, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  BasicDetailsWCAttachmentsUploadUrl(id: string, type: string) {
    return `${this.baseUrl}/${id}/${encodeURIComponent(type)}/upload-basic-details-wc-attachments`;
  };

  BasicDetailsWCAttachmentsDownload(id: string, fileId: string) {
    return this.http.get(`${this.baseUrl}/${id}/${fileId}/upload-basic-details-wc-attachments`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }


  BasicDetailsWCAttachmentsDelete(id: string, fileId: string) {
    return this.http.delete(`${this.baseUrl}/${id}/${fileId}/upload-basic-details-wc-attachments`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  getTemplateById(id,quoteId): Observable<IOneResponseDto<IWCTemplate>> {
    return this.http.get<IOneResponseDto<IWCTemplate>>(`${this.baseUrl}/${id}/${quoteId}/getTemplateById`, { headers: this.accountService.bearerTokenHeader() });
  }
}


