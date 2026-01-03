import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IQuoteSlip } from '../quote/quote.model';
import { IQuoteLocationOccupancy } from './quote-location-occupancy.model';
import { LazyLoadEvent } from 'primeng/api';
import { stringify } from 'query-string';

@Injectable({
    providedIn: 'root'
})
export class QuoteLocationOccupancyService extends CrudService<IQuoteLocationOccupancy> {


    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/quote-locations`, http, accountService, { populate: ['clientLocationId occupancyId quoteId pincodeId occupancySubTypeId'] });
    }

    toggleCovers(record: any): Observable<IOneResponseDto<IQuoteSlip>> {
        return this.http.post<IOneResponseDto<IQuoteSlip>>(`${this.baseUrl}/toggle-covers`, record, {
            headers: this.accountService.bearerTokenHeader(),

        });
    }

    downloadQuoteLocationOccupanciesExcel(quoteId: string) {
        return this.http.get(`${this.baseUrl}/${quoteId}/excel-download`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    uploadQuoteLocationOccupanciesExcelUrl(quoteId: string) {
        return `${this.baseUrl}/${quoteId}/excel-upload`;
    };

    uploadQuoteLocationOccupanciesExcel(quoteId: string, formData: FormData): Observable<any> {

        return this.http.post(`${this.baseUrl}/${quoteId}/excel-upload`, formData, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    downloadQuoteLocationOccupanciesRiskInspectionStatusExcel(quoteId: string) {
        return this.http.get(`${this.baseUrl}/${quoteId}/excel-download-risk-inspection-status`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    uploadQuoteLocationOccupanciesRiskInspectionStatusExcelUrl(quoteId: string) {
        return `${this.baseUrl}/${quoteId}/excel-upload-risk-inspection-status`;
    };

    riskInspectionReportDownload(id: string) {
        return this.http.get(`${this.baseUrl}/${id}/upload-risk-inspection-report`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    riskInspectionReportUploadUrl(id: string) {
        return `${this.baseUrl}/${id}/upload-risk-inspection-report`;
    };

    riskInspectionReportDelete(id: string) {
        return this.http.delete(`${this.baseUrl}/${id}/upload-risk-inspection-report`, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }


    downloadOtherAttachment(id: string) {
        return this.http.get(`${this.baseUrl}/upload-risk-inspection-other-attachment${id}/`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }


    otherAttachmentDelete(id: string) {
        return this.http.delete(`${this.baseUrl}/upload-risk-inspection-other-attachment/${id}`, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }

    layoutUploadDownload(id: string) {
        return this.http.get(`${this.baseUrl}/upload-risk-inspection-layout/${id}`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    layoutUploadUrl(id: string) {
        return `${this.baseUrl}/upload-risk-inspection-layout/${id}`;
    };

    layoutDelete(id: string) {
        return this.http.delete(`${this.baseUrl}/upload-risk-inspection-layout/${id}`, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }

    otherattachementDownload(id: string) {
        return this.http.get(`${this.baseUrl}/upload-risk-inspection-other-attachment/${id}`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    otherattachementUploadUrl(id: string) {
        return `${this.baseUrl}/upload-risk-inspection-other-attachment/${id}`;
    };

    barchartDownload(id: string) {
        return this.http.get(`${this.baseUrl}/upload-bar-chart-attachment/${id}`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    barchartUploadUrl(id: string) {
        return `${this.baseUrl}/upload-bar-chart-attachment/${id}`;
    };

    barchartDelete(id: string) {
        return this.http.delete(`${this.baseUrl}/upload-bar-chart-attachment/${id}`, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }

    BoqDownload(id: string) {
        return this.http.get(`${this.baseUrl}/upload-boq-attachment/${id}`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    BoqUploadUrl(id: string) {
        return `${this.baseUrl}/upload-boq-attachment/${id}`;
    };

    BoqDelete(id: string) {
        return this.http.delete(`${this.baseUrl}/upload-boq-attachment/${id}`, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }
   
    policyupload(id: string) {
        return `${this.baseUrl}/upload-policy-copy-psr/${id}`;
    };

    Riskcoverupload(id: string) {
        return `${this.baseUrl}/upload-risk-cover-letter/${id}`;
    };

    locationPhotoGraphDownload(id: string, imagePath: string) {
        return this.http.get(`${this.baseUrl}/${id}/upload-location-photographs?imagePath=${imagePath}`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }

    locationPhotoGraphUpdate(id: string, imagePath: string, description: string) {
        return this.http.patch(`${this.baseUrl}/${id}/upload-location-photographs?imagePath=${imagePath}`, { description: description }, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }

    locationPhotoGraphUploadUrl(id: string, queryParams) {
        return `${this.baseUrl}/${id}/upload-location-photographs?${stringify(queryParams)}`;
    };

    locationPhotoGraphUploadUrlPromptAI(id: string, formData) {
        return this.http.post( `${this.baseUrl}/${id}/prompt-ai`,formData,{
            headers: this.accountService.bearerTokenHeader(),
        });
    };
    locationPhotoGraphDelete(id: string, imagePath: string) {
        return this.http.delete(`${this.baseUrl}/${id}/upload-location-photographs?imagePath=${imagePath}`, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }



    downloadLocationWiseBreakExcel(quoteId: string, queryParams) {
        return this.http.get(`${this.baseUrl}/${quoteId}/excel-download-location-wise-breakup?${stringify(queryParams)}`, {
            headers: this.accountService.bearerTokenHeader(),
            observe: 'response',
            responseType: 'arraybuffer'
        });
    }



    //---------------------quote location occupancy
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

    getBulkImportProps(quoteId: string, queryParams, onUpload): PFileUploadGetterProps {
        return {
            name: 'quote_location_occupancy',
            url: `${this.baseUrl}/${quoteId}/excel-upload-v2?${stringify(queryParams)}`,
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


    //-----------------Risk locataion occupancy service
    // Old_Quote
    // bulkImportGenerateRiskInscpectionSample(quoteId: string) {

    // New_Quote_Option
    downloadRiskInscpectionSample(quoteOptionId: string) {
        return this.http.get<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${quoteOptionId}/risk-inspection-excel-download-quoteOption-v2`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    // Old_Quote
    // getBulkImportRiskInscpectionProps(quoteId: string, onUpload): PFileUploadGetterProps {
    // New_Quote_Option
    getBulkImportRiskInscpectionPropsQuoteOptionWise(quoteOptionId: string, onUpload): PFileUploadGetterProps {
        return {
            name: 'Risk-Inspection-Sheet',
            // Old_Quote
            // url: `${this.baseUrl}/${quoteId}/risk-inspection-excel-upload-v2`,
            // New_Quote_Option
            url: `${this.baseUrl}/${quoteOptionId}/risk-inspection-excel-upload-quoteOption-wise-v2`,
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

    updateLocationSumInsurer(id, payload) {
        return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/${id}/update-location-sum-insurer`, payload, {
            headers: this.accountService.bearerTokenHeader()
        });
    }
    externalLocationForQCR(event: LazyLoadEvent): Observable<IManyResponseDto<any>> {
        const payload = { ...event };
        payload["populate"] = this.options?.populate;
    
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/externalPrime`, payload, {
          // headers: this.accountService.bearerTokenHeader()
        });
      }

}



