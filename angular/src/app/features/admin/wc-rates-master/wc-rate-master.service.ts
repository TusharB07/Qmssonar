import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IWCRates } from './wc-rate-master.model';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WCRatesService extends CrudService<IWCRates> {

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/wcRates`, http, accountService, { populate: ['productId', 'partnerId', 'salaryId', 'businessTypeId'], })

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

  bulkImportGenerateSample(payload: any) {
    return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/bulk-import-generate-sample`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  getRatesMastersByProductId(id): Observable<IManyResponseDto<IWCRates>> {
    return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/${id}/getRatesMastersByProductId`, { headers: this.accountService.bearerTokenHeader() });
  }

  // checkUniqueName(payload){
  //   return this.http.post(`${this.baseUrl}/checkunique`, payload, {
  //       headers: this.accountService.bearerTokenHeader(),
  //     });
  // }
}
