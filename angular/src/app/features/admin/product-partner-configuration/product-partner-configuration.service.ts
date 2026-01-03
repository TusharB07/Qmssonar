import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IProductPartnerConfiguration } from './product-partner-configuration.model';
import { IBulkImportResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';

@Injectable({
  providedIn: 'root'
})
export class ProductPartnerConfigurationService extends CrudService<IProductPartnerConfiguration> {

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/product-partner-configuration`, http, accountService, { populate: ['partnerId', ' productId'] })
  }
  // Bulk Import -----------------------------------------------------------------------------------------
  bulkImportGenerateSample() {
    return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/bulk-import-generate-sample`, {
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
}
