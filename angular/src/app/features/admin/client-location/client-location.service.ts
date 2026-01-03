import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBulkImportResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IClientLocation } from './client-location.model';

@Injectable({
    providedIn: 'root'
})
export class ClientLocationService extends CrudService<IClientLocation>{

    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/client-locations`, http, accountService, { populate: ['cityId', 'stateId', 'pincodeId', 'clientId'] });
    }

    downloadClientLocationsExcel(clientId: string) {
        return this.http.get(`${this.baseUrl}/${clientId}/excel-download`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    // Excel Import and Sample Download v2 ---------------------------------------------------- START
    bulkImportGenerateSample(clientId: string) {
        return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${clientId}/excel-download-v2`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    bulkImport(clientId: string) {
        return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${clientId}/excel-upload-v2`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    getBulkImportProps(clientId: string, onUpload): PFileUploadGetterProps {
        return {
            name: 'client_locations',
            url: `${this.baseUrl}/${clientId}/excel-upload-v2`,
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

    uploadClientLocationsExcelUrl(clientId: string) {
        return `${this.baseUrl}/${clientId}/excel-upload`;
    };

    uploadClientLocationsExcel(quoteId: string, formData: FormData): Observable<any> {

        return this.http.post(`${this.baseUrl}/${quoteId}/excel-upload`, formData, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

}
