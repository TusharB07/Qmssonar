import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from "src/app/app.model";
import { IUser } from "./user.model";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { LazyLoadEvent } from "primeng/api";
import { CrudService } from "src/app/features/service/crud.service";

@Injectable({
    providedIn: "root"
})
export class UserService extends CrudService<IUser> {
    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/users`, http, accountService, { populate: ['partnerId roleId'] });
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
    getABranchCode() {
        return this.http.get(`${environment.apiUrl}/BranchMaster`, {
            headers: this.accountService.bearerTokenHeader()
        })
    }
    //image upload
  logoUpload(payload) {
    return this.http.post<IOneResponseDto<IUser>>(`${this.baseUrl}/photo-upload-v1`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }
}
