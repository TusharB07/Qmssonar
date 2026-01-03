import { Injectable } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IDANDOTemplate } from '../quote/quote.model';
import { IBulkImportResponseDto, IOneResponseDto } from 'src/app/app.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class liabilityTemplateService extends CrudService<IDANDOTemplate> {
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/liability-quote-template`, http, accountService, { populate: ['aoaAoyId insuredBusinessActivityId typeOfPolicyId natureOfBusinessId ageOfCompanyId retroactiveCoverId juridictionId territoryId'] });
  }

  updateliabilityTemplateService(payload: any) {
    return this.http.post(`${this.baseUrl}/updateLiabilityTemplate`, payload, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  SubsidiaryauditedfinancialReportUploadUrl(id: string) {
    return `${this.baseUrl}/${id}/upload-subsidairy-audited-financial-report`;
  };


  getSubsidairyFinantialReportFileName(id: string) {
    return this.http.get(`${this.baseUrl}/${id}/subsidairy-audited-financial-report-filename`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  SubsidiaryauditedfinancialReportDownload(id: string) {
    return this.http.get(`${this.baseUrl}/${id}/upload-subsidairy-audited-financial-report`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }


  SubsidiaryauditedfinancialReportDelete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}/upload-subsidairy-audited-financial-report`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }



  BasicDetailsAttachmentsUploadUrl(id: string, type: string) {
    return `${this.baseUrl}/${id}/${encodeURIComponent(type)}/upload-basic-details-attachments`;
  };

  BasicDetailsAttachmentsDownload(id: string, fileId: string) {
    return this.http.get(`${this.baseUrl}/${id}/${fileId}/upload-basic-details-attachments`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }


  BasicDetailsAttachmentsDelete(id: string, fileId: string) {
    return this.http.delete(`${this.baseUrl}/${id}/${fileId}/upload-basic-details-attachments`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  getTemplateById(id,quoteId): Observable<IOneResponseDto<IDANDOTemplate>> {
    return this.http.get<IOneResponseDto<IDANDOTemplate>>(`${this.baseUrl}/${id}/${quoteId}/getTemplateById`, { headers: this.accountService.bearerTokenHeader() });
  }

  createAndUpdateOption(payload: any) {
    return this.http.post(`${this.baseUrl}/createAndUpdateOption`, payload, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  editLiabilityQCR(quoteNo: string) {
    return this.http.post<IOneResponseDto<any[]>>(`${this.baseUrl}/qcr-edit-liability`, { quoteNo }, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

    downloadQCRExcelLiability(quoteOptionId: string, quoteNo: string, productId:string) {
      return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${quoteOptionId}/${productId}/excel-download-liability?quoteNo=${quoteNo}`, {
        headers: this.accountService.bearerTokenHeader()
      });
    }

}


