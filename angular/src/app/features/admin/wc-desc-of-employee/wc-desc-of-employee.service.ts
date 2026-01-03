import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IWCDescriptionOfEmployee } from './wc-desc-of-employee.model';
import { IBulkImportResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class WCDescriptionOfEmployeeService extends CrudService<IWCDescriptionOfEmployee> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/wcEmployeesDescriptions`, http, accountService,{ populate: [ 'productId', 'partnerId'] })
  }
  // checkUniqueName(payload){
  //   return this.http.post(`${this.baseUrl}/checkunique`, payload, {
  //       headers: this.accountService.bearerTokenHeader(),
  //     });
  //   }

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
}
