import { Injectable } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ICGLTemplate } from './quote.model';
import { IOneResponseDto } from 'src/app/app.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class liabilityCGLTemplateService extends CrudService<ICGLTemplate> {
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/liability-cgl-quote-template`, http, accountService, { populate: ['insuredBusinessActivityId typeOfPolicyId juridictionId territoryId retroactiveCoverId aoaAoyId typeOfProductId'] });
  }

  updateliabilityTemplateService(payload: any) {
    return this.http.post(`${this.baseUrl}/updateLiabilityTemplate`, payload, {
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

  getTemplateById(id,quoteId): Observable<IOneResponseDto<ICGLTemplate>> {
    return this.http.get<IOneResponseDto<ICGLTemplate>>(`${this.baseUrl}/${id}/${quoteId}/getTemplateById`, { headers: this.accountService.bearerTokenHeader() });
  }
  
  createAndUpdateOption(payload: any) {
    return this.http.post(`${this.baseUrl}/createAndUpdateOption`, payload, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }


  ListOfLocationsAttachmentsUploadUrl(id: string, type: string) {
    return `${this.baseUrl}/${id}/${encodeURIComponent(type)}/upload-listofLocations-attachments`;
  };

  ListOfLocationsAttachmentsDownload(id: string, fileId: string) {
    return this.http.get(`${this.baseUrl}/${id}/${fileId}/upload-listofLocations-attachments`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }


  ListOfLocationsAttachmentsDelete(id: string, fileId: string) {
    return this.http.delete(`${this.baseUrl}/${id}/${fileId}/upload-listofLocations-attachments`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }
}


