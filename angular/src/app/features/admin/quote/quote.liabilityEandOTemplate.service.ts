import { Injectable } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IEandOTemplate } from '../quote/quote.model';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class liabilityEandOTemplateService extends CrudService<IEandOTemplate>{
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/liability-eando-quote-template`, http, accountService, { populate: ['numberOfExperienceId retroactiveCoverId juridictionId territoryId' ] });    
  }

  updateliabilityEandOTemplateService(payload: any) {
    return this.http.post(`${this.baseUrl}/updateLiabilityEandOTemplate`, payload, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  SubsidiaryAnnualReportUploadUrl(id: string) {
    return `${this.baseUrl}/${id}/upload-subsidairy-annual-report`;
};


getSubsidiaryAnnualReportDownloadFileName(id: string){
      return this.http.get(`${this.baseUrl}/${id}/subsidairy-annual-report-filename`, {
          headers: this.accountService.bearerTokenHeader(),
        });
  }

SubsidiaryAnnualReportDownload(id: string) {
  return this.http.get(`${this.baseUrl}/${id}/upload-subsidairy-annual-report`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
  });
}


SubsidiaryAnnualReportDelete(id: string) {
  return this.http.delete(`${this.baseUrl}/${id}/upload-subsidairy-annual-report`, {
      headers: this.accountService.bearerTokenHeader(),
  });
}



BasicDetailsEandOAttachmentsUploadUrl(id: string,type:string) {
  return `${this.baseUrl}/${id}/${encodeURIComponent(type)}/upload-basic-details-eando-attachments`;
};

BasicDetailsEandOAttachmentsDownload(id: string,fileId:string) {
return this.http.get(`${this.baseUrl}/${id}/${fileId}/upload-basic-details-eando-attachments`, {
    headers: this.accountService.bearerTokenHeader(),
    observe: 'response',
    responseType: 'arraybuffer'
});
}


BasicDetailsEandOAttachmentsDelete(id: string,fileId:string) {
return this.http.delete(`${this.baseUrl}/${id}/${fileId}/upload-basic-details-eando-attachments`, {
    headers: this.accountService.bearerTokenHeader(),
});
}


getTemplateById(id,quoteId): Observable<IOneResponseDto<IEandOTemplate>> {
  return this.http.get<IOneResponseDto<IEandOTemplate>>(`${this.baseUrl}/${id}/${quoteId}/getTemplateById`, { headers: this.accountService.bearerTokenHeader() });
}

createAndUpdateOption(payload: any) {
  return this.http.post(`${this.baseUrl}/createAndUpdateOption`, payload, {
    headers: this.accountService.bearerTokenHeader(),
  });
}
}


