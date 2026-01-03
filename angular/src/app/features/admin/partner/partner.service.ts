import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Observable } from "rxjs";
import { IOneResponseDto, IManyResponseDto, PFileUploadGetterProps, IBulkImportResponseDto } from "src/app/app.model";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { IPartner } from "./partner.model";

@Injectable({
    providedIn: "root"
})
export class PartnerService extends CrudService<any> {
    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/partners`, http, accountService, { populate: ["cityId", "districtId", "stateId", "pincodeId", "countryId", "icPartnerId"] });
    }

    createFormData(formData: FormData): Observable<IOneResponseDto<IPartner>> {
        return this.http.post<IOneResponseDto<IPartner>>(`${this.baseUrl}/`, formData, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    copyRates(payload, of): Observable<IOneResponseDto<IPartner>> {
        return this.http.post<IOneResponseDto<IPartner>>(`${this.baseUrl}/copyPartnerRates?${of}=true`, payload, {
            headers: this.accountService.bearerTokenHeader()
        });
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

    getBulkproductImportProps(onUpload: (dto: IOneResponseDto<IBulkImportResponseDto>) => void): PFileUploadGetterProps {
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
            chooseLabel: "Bulk product partner Import Excel Upload",
        }
    }
    // Bulk Import -----------------------------------------------------------------------------------------

    async searchOptionsPartners(event?: any) {

        let lazyLoadEvent: LazyLoadEvent = {
            first: 0,
            rows: 200,
            sortField: null,
            sortOrder: 1,
            filters: {
                // @ts-ignore
                status: [
                    {
                        value: true,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            },
            globalFilter: null,
            multiSortMeta: null
        }

        if (event?.query) {
            lazyLoadEvent['filters'] = {
                // @ts-ignore
                name: [
                    {
                        value: event?.query,
                        matchMode: "startsWith",
                        operator: "or"
                    }
                ],
                // @ts-ignore
                status: [
                    {
                        value: true,
                        matchMode: "equals",
                        operator: "and"
                    }
                ]
            
            }
        }


        const response = await this.getMany(lazyLoadEvent).toPromise()

        return response.data.entities.map((partner) => ({ label: partner.name, value: partner._id , partnerType : partner.partnerType}));
    }

    logoUpload(payload){
        return this.http.post<IOneResponseDto<IPartner>>(`${this.baseUrl}/logo-upload-v1`, payload, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

}
