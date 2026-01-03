import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBulkImportResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IUnderWriter } from './under-writer.model';

@Injectable({
    providedIn: 'root'
})
export class UnderWriterService extends CrudService<IUnderWriter> {


    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/under-writter`, http, accountService, { populate: ['productId', 'sectorId', 'underWriter1RoleId', 'underWriter2RoleId', 'underWriter3RoleId', 'underWriter4RoleId', 'underWriter5RoleId', 'underWriter6RoleId', 'underWriter7RoleId', 'underWriter8RoleId', 'underWriter9RoleId', 'underWriter10RoleId', 'occupancyId'] });
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
    // Bulk Import -----------------------------------------------------------------------------------------

}
