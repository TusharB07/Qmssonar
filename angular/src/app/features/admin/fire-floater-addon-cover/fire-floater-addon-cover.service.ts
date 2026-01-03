

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Observable } from "rxjs";
import { IOneResponseDto, IManyResponseDto, ILov } from "src/app/app.model";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { IFireFloaterCoverAddOn } from "./fire-floater-addon-cover.model";

@Injectable({
    providedIn: "root"
})
export class FireFloaterAddonCoverService extends CrudService<IFireFloaterCoverAddOn> {

    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/fireFloaterCoverAddOn`, http, accountService, { populate: [] });
    }
    // Old_Quote
    // toggleAllFloaterCoverAddOn(quoteId): Observable<IManyResponseDto<any>> {
    //     return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/${quoteId}/toggle`, {}, { headers: this.accountService.bearerTokenHeader() });
    // }

    // getAllFloaterCoverAddOn(quoteId): Observable<IOneResponseDto<any>> {
    //     return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/${quoteId}/get`, {}, { headers: this.accountService.bearerTokenHeader() });
    // }

    // setAllFloaterCoverAddOn(quoteId, payload): Observable<IManyResponseDto<any>> {
    //     return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/${quoteId}/set`, payload, { headers: this.accountService.bearerTokenHeader() });
    // }

    // New_Quote_Option
    toggleAllFloaterCoverAddOn(quoteOptionId): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/${quoteOptionId}/toggle`, {}, { headers: this.accountService.bearerTokenHeader() });
    }

    getAllFloaterCoverAddOn(quoteOptionId): Observable<IOneResponseDto<any>> {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/${quoteOptionId}/get`, {}, { headers: this.accountService.bearerTokenHeader() });
    }

    setAllFloaterCoverAddOn(quoteOptionId, payload): Observable<IManyResponseDto<any>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/${quoteOptionId}/set`, payload, { headers: this.accountService.bearerTokenHeader() });
    }
}
