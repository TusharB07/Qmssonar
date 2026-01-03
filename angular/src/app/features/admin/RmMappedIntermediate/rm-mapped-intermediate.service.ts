import { Injectable } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../../account/account.service';
import { environment } from 'src/environments/environment';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';


@Injectable({
  providedIn: 'root'
})
export class RmMappedIntermediateService extends CrudService<any>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/rmMappedIntermediate`, http, accountService, { populate: ["partnerId", "rmUserId", "intermediatePartnerId"] });
}

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
