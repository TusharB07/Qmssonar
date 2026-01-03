import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { LazyLoadEvent, MessageService } from "primeng/api";
import { Observable, ReplaySubject } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IAppErrorEnvelope, IManyResponseDto } from "./app.model";
import { IDiffHistory, IDiff } from "./components/audit-trail/audit-trail.model";
import { AccountService } from "./features/account/account.service";
import { AllowedQuoteStates } from "./features/admin/quote/quote.model";

@Injectable({
    providedIn: "root"
})
export class AppService {
    baseUrl = environment.apiUrl;

    private lastErrorSource = new ReplaySubject<IAppErrorEnvelope>(null);
    lastError$ = this.lastErrorSource.asObservable();

    constructor(private http: HttpClient, public messageService: MessageService, private router: Router, protected accountService: AccountService) { }

    setLastError(errorEnvelope: IAppErrorEnvelope) {
        this.lastErrorSource.next(errorEnvelope);

    }

    // To List Records from the DB
    getDiffHistory(id, entityResourcePrefix, event: LazyLoadEvent): Observable<IManyResponseDto<IDiffHistory>> {
        const payload = { ...event };

        return this.http
            .post<IManyResponseDto<IDiffHistory>>(`${this.baseUrl}/${entityResourcePrefix}/diff/${id}`, payload, {
                headers: this.accountService.bearerTokenHeader()
            })
            .pipe(
                map(res => {
                    // console.log(res.data.entities)
                    res.data.entities = res.data.entities.map(record => {
                        const diffs = record.diff;
                        const updatedDiffs: {
                            [s: string]: IDiff;
                        } = {};
                        const eventType = record.eventType;
                        for (const key in diffs) {
                            const diff = diffs[key];
                            if (eventType === "onCreate") {
                                updatedDiffs[key] = { old: null, new: diff[0] };
                            }
                            if (eventType === "onDelete") {
                                updatedDiffs[key] = { old: diff[0], new: null };
                            }
                            if (eventType === "onUpdate") {
                                updatedDiffs[key] = { old: diff[0], new: diff[1] };
                            }
                        }

                        record.diff = updatedDiffs;

                        return record;
                    });
                    return res;
                })
            );
    }
    createValidationErrorToast(form: FormGroup) {
        const invalidControls = [];
        const controls = form.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalidControls.push(name);
            }
        }
        console.log(invalidControls);

        const errorsLi = invalidControls.map(error => `<li>Validation error in field: ${error}</li>`);
        let errorsUl;
        if (errorsLi) {
            errorsUl = `<ul>${errorsLi.join("")}</ul>`;
        }

        this.messageService.clear("error");
        this.messageService.add({
            key: "error",
            sticky: true,
            severity: "error",
            summary: "Validation Errors",
            detail: errorsUl
        });
    }

    downloadSampleExcel(response) {
        console.log("downloading...")
        let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Sample-Import-File.xlsx';

        const a = document.createElement('a')
        const blob = new Blob([response.body], { type: response.headers.get('content-type') });
        const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
        const objectUrl = window.URL.createObjectURL(file);

        a.href = objectUrl
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(objectUrl);


    }

    // downloadQCRExcel(response) {
    //     console.log("downloading...")
    //     let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? 'Sample-Import-File.xlsx';
    //
    //     const a = document.createElement('a')
    //     const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    //     const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
    //     const objectUrl = window.URL.createObjectURL(file);
    //
    //     a.href = objectUrl
    //     a.download = fileName;
    //     a.click();
    //     URL.revokeObjectURL(objectUrl);
    // }

    downloadQCRExcel(fileName, url) {

        const a = document.createElement('a')

        a.href = url
        a.download = fileName;
        a.click();
        // URL.revokeObjectURL(url);
    }

    // downloadSampleExcelwithCustomizeFileName(response,filename) {
    //     console.log("downloading...")
    //     let fileName = response?.headers?.get('content-disposition')?.split(';')[1]?.split('=')[1]?.replace(/\"/g, '') ?? filename;

    //     const a = document.createElement('a')
    //     const blob = new Blob([response.body], { type: response.headers.get('content-type') });
    //     const file = new File([blob], 'Hello', { type: response.headers.get('content-type'), });
    //     const objectUrl = window.URL.createObjectURL(file);

    //     a.href = objectUrl
    //     a.download = fileName;
    //     a.click();
    //     URL.revokeObjectURL(objectUrl);


    // }

    downloadFileFromUrl(fileName, url) {

        const a = document.createElement('a')

        a.href = url
        a.download = fileName;
        a.click();
        // URL.revokeObjectURL(url);
    }

    downloadFileFromUrlWithCustomFileName(fileName, url) {

        const a = document.createElement('a');

        // Assuming 'downloadUrl' is the URL that provides the file content
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                // Creating a Blob URL
                const blobUrl = window.URL.createObjectURL(blob);
                a.href = blobUrl;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(error => {
                console.error('Error fetching the file:', error);
            });
    }

    private toQueryParams(obj, prefix) {
        var str = [],
            p;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p];
                str.push((v !== null && typeof v === "object") ?
                    this.toQueryParams(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
        }
        return str.join("&");
    }

    routes = {
        quotes: {
            list: (options?: { params: { stage: AllowedQuoteStates[] } }) => {
                // console.log(options?.stage == )

                let queryParams = ''
                if (options?.params?.stage) {
                    queryParams = '?'
                    queryParams += this.toQueryParams({ stage: JSON.stringify(options?.params?.stage) }, '')
                }

                return `/backend/quotes${queryParams}`
            },
            new: () => `/backend/quotes/new`,
            draft: (quoteId) => `/backend/quotes/${quoteId}`,
            requisition: (quoteId: string, options?: { params: { location: string } }) => {

                let queryParams = ''
                if (options?.params) {
                    queryParams = '?'
                    queryParams += this.toQueryParams(options.params, '')
                }

                return `/backend/quotes/${quoteId}/requisition${queryParams}`
            },
            requisitionReview: (quoteId) => `/backend/quotes/${quoteId}/requisition/review`,

            gapReportReview: (quoteId) => `/backend/quotes/${quoteId}/gap-analysis-report`,

            edit: (quoteId: string, options?: { params: { location: string } }) => {

                let queryParams = ''
                if (options?.params) {
                    queryParams = '?'
                    queryParams += this.toQueryParams(options.params, '')
                }

                return `/backend/quotes/${quoteId}/edit${queryParams}`;
            },

            compareAndAnalytics: (quoteId) => `/backend/quotes/${quoteId}/compare-and-analytics`,
            // comparisionReview: (quoteId) => `/backend/quotes/${quoteId}/comparision-review`,
            comparisionReviewDetailed: (quoteId) => `/backend/quotes/${quoteId}/comparision-review-detailed`,
            placement: (quoteId) => `/backend/quotes/${quoteId}/placement`,
            placementSlipReview: (quoteId, selectedQuoteId) => `/backend/quotes/${quoteId}/placement-slip-review/${selectedQuoteId}`,
            pdfPreview: (quoteId) => `/backend/quotes/${quoteId}/pdf-preview`,
            offlinePayment: (quoteId) => `/backend/quotes/${quoteId}/offline-payment`,
        }

    }
}
