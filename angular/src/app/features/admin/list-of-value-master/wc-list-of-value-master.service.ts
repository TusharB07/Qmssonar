import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IBulkImportResponseDto, IManyResponseDto, IOneResponseDto, PFileUploadGetterProps } from 'src/app/app.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { WCAllowedListOfValuesMasters, IWCListOfValueMaster } from './list-of-value-master.model';

@Injectable({
    providedIn: 'root'
})
export class WCListOfValueMasterService extends CrudService<IWCListOfValueMaster> {

    routeSource = new ReplaySubject<string>();
    routeSource$ = this.routeSource.asObservable();


    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/wc-list-of-values`, http, accountService, { populate: ['parentLovId productId partnerId'] });
    }


    current(lovName: WCAllowedListOfValuesMasters, productId: string = ''): Observable<IManyResponseDto<IWCListOfValueMaster>> {

        return this.http.get<IManyResponseDto<IWCListOfValueMaster>>(`${this.baseUrl}/current/${lovName}?productId=${productId}`, {
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

    bulkImportGenerateSample(payload: any) {
        return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/bulk-import-generate-sample`, payload, {
            headers: this.accountService.bearerTokenHeader()
        });
    }
}

