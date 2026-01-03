import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IClaimExperience } from './claim-experience.model';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { ActivatedRoute } from '@angular/router';
import { stringify } from 'query-string';

@Injectable({
  providedIn: 'root'
})
export class ClaimExperienceService extends CrudService<IClaimExperience> {
  quoteOptionId:any

  constructor( protected http: HttpClient, protected  accountService: AccountService,private activatedRoute:ActivatedRoute) { 
    super(`${environment.apiUrl}/claim-experience-router`, http, accountService, { populate: ['quoteId'] })
    this.quoteOptionId = this.activatedRoute.snapshot.queryParamMap.get('quoteOptionId');

  }

  getClaimsExperienceOfInsurer(event: LazyLoadEvent): Observable<IManyResponseDto<IClaimExperience>> {
    const payload = { ...event };
    payload["populate"] = this.options?.populate;

    return this.http.post<IManyResponseDto<IClaimExperience>>(`${this.baseUrl}/insurerPrime`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }
  bulkExportGenerateSample(id: string,queryParams?:any) {
    return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${id}/bulk-import-generate-sample?${stringify(queryParams)}`, {
        headers: this.accountService.bearerTokenHeader()
    });
  }

  getBulkImportProps(id: string, onUpload): PFileUploadGetterProps {

    return {
        name: 'bulk_import',
        url: `${this.baseUrl}/${id}/bulk-import?quoteOptionId=${this.quoteOptionId}`,
        mode: 'basic',
        headers: this.accountService.bearerTokenHeader(),
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
        maxFileSize: 100000,
        method: 'post',
        onUpload: onUpload,
        auto: true,
        uploadLabel: 'Click to Upload',
        chooseLabel: 'Upload Excel Sheet',
    };
}

claimExperienceReportUpload(id: string, onUpload):PFileUploadGetterProps{
  return {
    name: 'file',
    url: `${this.baseUrl}/${id}/upload-file?quoteOptionId=${this.quoteOptionId}`,
    mode: 'basic',
    headers: this.accountService.bearerTokenHeader(),
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
    maxFileSize: 100000,
    method: 'post',
    onUpload: onUpload,
    auto: true,
    uploadLabel: 'Click to Upload',
    chooseLabel: 'Upload Excel Sheet',
};
}
}
