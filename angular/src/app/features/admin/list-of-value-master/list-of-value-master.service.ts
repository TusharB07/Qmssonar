import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { ISequence } from '../sequence/sequence.model';
import { AllowedListOfValuesMasters, IListOfValueMaster } from './list-of-value-master.model';

@Injectable({
    providedIn: 'root'
})
export class ListOfValueMasterService extends CrudService<IListOfValueMaster> {

    routeSource = new ReplaySubject<string>();
    routeSource$ = this.routeSource.asObservable();


    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/list-of-values`, http, accountService, { populate: ['parentLovId productId partnerId'] });
    }


    current(lovName: AllowedListOfValuesMasters, productId: string = ''): Observable<IManyResponseDto<IListOfValueMaster>> {
        // const payload = { ...event };
        // payload['populate'] = this.options?.populate;

        return this.http.get<IManyResponseDto<IListOfValueMaster>>(`${this.baseUrl}/current/${lovName}?productId=${productId}`, {
            headers: this.accountService.bearerTokenHeader()
        });
    }
}

