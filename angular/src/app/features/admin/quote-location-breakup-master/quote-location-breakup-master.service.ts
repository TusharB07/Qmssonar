import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IQuoteLocaitonBreakupMaster } from './quote-location-breakup-master.model';

@Injectable({
    providedIn: 'root'
})
export class QuoteLocationBreakupMasterService extends CrudService<IQuoteLocaitonBreakupMaster> {


    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/quote-locations-breakup`, http, accountService, { populate: ['quoteId', 'quoteOptionId', 'quoteLocationOccupancyId'] });
    }

    batchUpsert(id, record: Partial<any>): Observable<IManyResponseDto<any>> {
        return this.http.patch<IManyResponseDto<any>>(`${this.baseUrl}/${id}/batch-upsert`, record, { headers: this.accountService.bearerTokenHeader() });
    }
    
    batchUpsertWithAi(id, record): Observable<IManyResponseDto<any>> {
        return this.http.patch<IManyResponseDto<any>>(`${this.baseUrl}/${id}/batch-upsert-with-ai`, record, { headers: this.accountService.bearerTokenHeader() });
    }

    batchUpsertMailParser(id, record): Observable<IManyResponseDto<any>> {
        return this.http.patch<IManyResponseDto<any>>(`${this.baseUrl}/${id}/batch-upsert-mail-parser`, record, { headers: this.accountService.bearerTokenHeader() });
    }

    // New_Quote_Option
    quoteOptionBatchUpsert(id, record: Partial<any>): Observable<IManyResponseDto<any>> {
        return this.http.patch<IManyResponseDto<any>>(`${this.baseUrl}/${id}/quoteOption-batch-upsert`, record, { headers: this.accountService.bearerTokenHeader() });
    }


    downloadQuoteLocationBreakupExcel(quoteId: string) {
        return this.http.get(`${this.baseUrl}/${quoteId}/excel-download`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    // Old_Quote
    // uploadQuoteLocationBreakupExcelUrl(quoteId: string) {
    //     return `${this.baseUrl}/${quoteId}/excel-upload-v2`;
    // };

    // New_Quote_Option
    uploadQuoteLocationBreakupExcelUrl(quoteOptionId: string) {
        return `${this.baseUrl}/${quoteOptionId}/excel-upload-quoteOption-wise-v2`;
    };

    getTreeFromFlatArray(flatArray) {
        const delimiter = "::>::";

        const treeArrayFromFlatArray: TreeNode[] = [];

        for (const key in flatArray) {
            const keys = key.split(delimiter);
            let currentNode = treeArrayFromFlatArray;
            for (let i = 0; i < keys.length; i++) {
                let found = false;
                for (let j = 0; j < currentNode.length; j++) {
                    if (currentNode[j].data.key === keys[i]) {
                        currentNode = currentNode[j].children;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    let newNode = {};
                    if (i === keys.length - 1) {
                        newNode = {
                            data: {
                                "key": keys[i],
                                ...flatArray[key]
                            },
                            leaf: true,
                            // expanded: false,
                            // children: []
                        };
                    } else {
                        newNode = {
                            data: {
                                "key": keys[i]
                            },
                            expanded: true,
                            leaf: false,
                            children: []
                        };
                    }
                    currentNode.push(newNode);
                    currentNode = newNode['children'];
                }
            }
        }


        return treeArrayFromFlatArray
    }

    getFirstLeafNode(node) {
        if (node.leaf) {
            return node.data;
        } else if (node.children.length > 0) {
            return this.getFirstLeafNode(node.children[0]);
        }
        return null;
    }

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
            name: 'quote_location_breakup',
            // Old_Quote
            // url: `${this.baseUrl}/${quoteId}/excel-upload-v2`,
            // New_Quote_Option
            url: `${this.baseUrl}/${quoteOptionId}/excel-upload-quoteOption-wise-v2`,
            mode: 'basic',
            headers: this.accountService.bearerTokenHeader(),
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
            maxFileSize: 100000,
            method: 'post',
            onUpload: onUpload,
            auto: true,
            uploadLabel: 'Click to Upload',
            chooseLabel: 'Upload Excel Sheet',
        };
    }

}
