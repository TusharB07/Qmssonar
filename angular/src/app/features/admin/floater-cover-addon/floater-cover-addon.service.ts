import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IFloaterCoverAddOn } from './floater-cover-addon.model';

@Injectable({
    providedIn: 'root'
})
export class FloaterCoverAddonService extends CrudService<IFloaterCoverAddOn> {

    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/floaterCoverAddOn`, http, accountService, { populate: ['quoteId'] })

    }

    setAllFloater(record: any): Observable<IOneResponseDto<IFloaterCoverAddOn>> {
        return this.http.post<IOneResponseDto<IFloaterCoverAddOn>>(`${this.baseUrl}/set-all-floater`, record, {
            headers: this.accountService.bearerTokenHeader()
        });
    }
    getAllFloater(record: any): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/get-all-floater`, record, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    downloadFloaterExcel(quoteId: string) {
        return this.http.get(`${this.baseUrl}/${quoteId}/excel-download`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    uploadFloaterExcelUrl(quoteId: string) {
        return `${this.baseUrl}/${quoteId}/excel-upload`;
    };



    // Excel Import and Sample Download v2 ---------------------------------------------------- START
    bulkImportGenerateSample(quoteId: string) {
        return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${quoteId}/excel-download-v2`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    bulkImport(quoteId: string) {
        return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${quoteId}/excel-upload-v2`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    getBulkImportProps(quoteId: string, onUpload): PFileUploadGetterProps {
        return {
            name: 'floater_cover_addon',
            url: `${this.baseUrl}/${quoteId}/excel-upload-v2`,
            mode: "basic",
            headers: this.accountService.bearerTokenHeader(),
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
            maxFileSize: 100000,
            method: 'post',
            onUpload: onUpload,
            auto: true,
            uploadLabel: "Click to Upload ",
            chooseLabel: "Upload Excel Sheet",
        }
    }
    // Excel Import and Sample Download v2 ---------------------------------------------------- END
}
