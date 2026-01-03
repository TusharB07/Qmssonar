import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IQuoteGmcTemplate } from '../quote/quote.model';
import { IOneResponseDto } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class QoutegmctemplateserviceService extends CrudService<IQuoteGmcTemplate>{
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/gmctemplate`, http, accountService, { populate: ['id'] });
  }

  updateQuotePlacedOption(id: string, optionid: string) {
    return this.http.get(`${this.baseUrl}/${id}/${optionid}/updateQuotePlacedOption`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }
  createAndUpdateOption(payload: any) {
    return this.http.post(`${this.baseUrl}/createAndUpdateOption`, payload, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }
  getAIAnswers(id: string, tabName:string) {  
    return this.http.get<IOneResponseDto<any>>(`${this.baseUrl}/${id}/${tabName}/gmcprompt-ai`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }


  getAIPolicyScrunity(id: string) {  
    return this.http.get<IOneResponseDto<any>>(`${this.baseUrl}/${id}/gmcpromptscrunityai`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }
  
  DayCareUploadUrl(id: string) {
    return `${this.baseUrl}/${id}/upload-dayCare-report`;
  };

  getDayCareFileName(id: string) {
    return this.http.get(`${this.baseUrl}/${id}/upload-dayCare-report`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  DayCareDownload(id: string) {
    return this.http.get(`${this.baseUrl}/${id}/upload-dayCare-report`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }


  DayCareDelete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}/upload-dayCare-report`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  BasicDetailsQCRAttachmentsUploadUrl(id: string, filename: string,type:string) {
    return `${this.baseUrl}/${id}/${encodeURIComponent(filename)}/${encodeURIComponent(type)}/upload-basicdetailsqcr-attachments`;
  };

  BasicDetailsQCRAttachmentsDownload(id: string, fileId: string) {
    return this.http.get(`${this.baseUrl}/${id}/${fileId}/upload-basicdetailsqcr-attachments`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }


  BasicDetailsQCRAttachmentsDelete(id: string, fileId: string) {
    return this.http.delete(`${this.baseUrl}/${id}/${fileId}/upload-basicdetailsqcr-attachments`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  editQCR(quoteNo: string) {
    return this.http.post<IOneResponseDto<any[]>>(`${this.baseUrl}/qcr-edit`, { quoteNo }, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

   createQuoteOptionQCRVersioning(insurerQuoteOptionId: string, brokerQuoteId: string) {
      return this.http.post<IOneResponseDto<any[]>>(`${this.baseUrl}/create-quoteOption-version`, { insurerQuoteOptionId, brokerQuoteId }, {
        headers: this.accountService.bearerTokenHeader()
      });
    }

}
