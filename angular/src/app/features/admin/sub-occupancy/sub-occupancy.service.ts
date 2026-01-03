import { Injectable } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { ISubOccupancy } from './sub-occupancy-model';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IManyResponseDto } from 'src/app/app.model';
import { IBulkImportResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class SubOccupancyService extends CrudService<ISubOccupancy> {

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/OccupancySubType`, http, accountService, { populate: ["productId", "partnerId","occupancyId"] });
}

getMatching(payload): Observable<IManyResponseDto<ISubOccupancy>> {
  // const payload = { ...event };
  // payload["populate"] = this.options?.populate;

  return this.http.post<IManyResponseDto<ISubOccupancy>>(`${this.baseUrl}/match`, payload, {
      headers: this.accountService.bearerTokenHeader()
  });
}
   // Bulk Import -----------------------------------------------------------------------------------------
   bulkImportGenerateSample(payload :any) {
    return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/bulk-import-generate-sample`, payload ,{
      headers: this.accountService.bearerTokenHeader()
    });
  }
  
  getBulkImportProps(onUpload: (dto: IOneResponseDto<IBulkImportResponseDto>) => void): PFileUploadGetterProps {
    return {
      name: 'bulk_import',
      url: `${this.baseUrl}/bulk-import`,
      mode: "basic",
      headers: this.accountService.bearerTokenHeader(),
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
      maxFileSize: 1000000,
      method: 'post',
      onUpload: onUpload,
      auto: true,
      // uploadLabel: "Bulk Import ",
      chooseLabel: "Bulk Import Excel Upload",
    }
  }
  // Bulk Import -----------------------------------------------------------------------------------------  
}
