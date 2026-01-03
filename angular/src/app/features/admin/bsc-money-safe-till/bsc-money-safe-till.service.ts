import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBulkImportResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IBscMoneySafeTillCover } from './bsc-money-safe-till.model';

@Injectable({
    providedIn: 'root'
})
export class BscMoneySafeTillService extends CrudService<any> {


    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/bsc-money-safe-till-cover`, http, accountService, { populate: ["quoteId", 'quoteLocationOccupancyId', 'occupancyId'] });
    }

    downloadSampleExcel(id: string) {
        return this.http.get(`${this.baseUrl}/breakup-bulk-import-sample/${id}`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    // Excel Import and Sample Download v2 ---------------------------------------------------- START
    // Old_Quote
    // bulkImportGenerateSample(quoteId: string) {

    // New_Quote_Option
    bulkImportGenerateSample(quoteOptionId: string) {
        return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${quoteOptionId}/excel-download-quoteOption-wise-v2`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    // Old_Quote
    // getBulkImportProps(quoteId: string, onUpload): PFileUploadGetterProps {
    // New_Quote_Option
    getBulkImportProps(quoteOptionId: string, onUpload): PFileUploadGetterProps {
        return {
            name: 'excel_upload',
            // Old_Quote
            // url: `${this.baseUrl}/${quoteId}/excel-upload-v2`,
            // New_Quote_Option
            url: `${this.baseUrl}/${quoteOptionId}/excel-upload-quoteOption-wise-v2`,
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

    deleteFilePath(payload) {
        return this.http.post(`${this.baseUrl}/delete-individual-bsc-cover-file`, payload, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }
}
