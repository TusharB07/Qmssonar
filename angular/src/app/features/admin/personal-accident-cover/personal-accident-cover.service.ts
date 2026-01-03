import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IPersonalAccidentCover } from './personal-accident-cover.model';
import { Observable } from 'rxjs';
import { IManyResponseDto } from 'src/app/app.model';

@Injectable({
    providedIn: 'root'
})
export class PersonalAccidentCoverService extends CrudService<any> {

    constructor( protected http: HttpClient, protected  accountService: AccountService) {
        super(`${environment.apiUrl}/personalAccidentCover`, http, accountService, { populate: ['quoteId'] })
    }
    batchCreate(body): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/batch-create`, body, { headers: this.accountService.bearerTokenHeader() });
    }

    deleteFilePath(payload) {
        return this.http.post(`${this.baseUrl}/delete-individual-bsc-cover-file`,payload, {
            headers: this.accountService.bearerTokenHeader(),
        });
    }
    downloadPersonalAccidentCoversExcel(quoteId: string): Observable<Blob> {
        const url = `${this.baseUrl}/download/${quoteId}`;
        return this.http.get(url, {
            responseType: 'blob',
            headers: this.accountService.bearerTokenHeader()
        });
    }

    parsePersonalAccidentCoversExcel(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/upload`, formData);
        headers: this.accountService.bearerTokenHeader()
    }
}
