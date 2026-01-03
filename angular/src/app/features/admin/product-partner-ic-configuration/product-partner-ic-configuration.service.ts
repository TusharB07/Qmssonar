import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IProductPartnerIcConfigration } from './product-partner-ic-configuration.model';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class ProductPartnerIcConfigurationService extends CrudService<IProductPartnerIcConfigration> {

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/product-partner-ic-configuration`, http, accountService, { populate: [' productId', 'brokerPartnerId', 'insurerPartnerId'] })
  }
  getInsurerMappedAllProducts() {
    return this.http.get<IManyResponseDto<any>>(`${this.baseUrl}/insurer-mapped-products`, { headers: this.accountService.bearerTokenHeader() });
  }

  bulkImportGenerateSample() {
    return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/bulk-import-generate-sample-`, {}, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  upload(id: string, file: any) {
    return this.http.post(`${this.baseUrl}/${id}/bulk-import`, file, {
      headers: this.accountService.bearerTokenHeader(),
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
}
