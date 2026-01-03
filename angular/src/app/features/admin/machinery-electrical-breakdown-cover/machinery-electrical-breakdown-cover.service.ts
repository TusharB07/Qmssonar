import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IMachineryLossOfProfitCover } from '../machinery-loss-of-profit-cover/machinery-loss-of-profit-cover.model';
import { IMachineryELectricalBreakDownCover } from '../machinery-electrical-breakdown-cover/machinery-electrical-breakdown-cover.model';
import { Observable } from 'rxjs';
import { IOneResponseDto, IManyResponseDto } from 'src/app/app.model';
import { IFloaterCoverAddOn } from '../floater-cover-addon/floater-cover-addon.model';

export interface IMachineryResponse {
    quoteLocationOccupancyId: string
    locationName: string
    stock: number
    machineryPercentage: number
    sumInsured: number
}


@Injectable({
    providedIn: 'root'
})
export class MachineryElectricalBreakdownCoverService extends CrudService<IMachineryELectricalBreakDownCover> {


    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/machineryElectricalBreakdown`, http, accountService, { populate: ["quoteId"] });
    }

    setAllMachinery(record: { quoteOptionId: string, payload: IMachineryResponse[] }): Observable<IOneResponseDto<any>> {
        return this.http.post<IOneResponseDto<any>>(`${this.baseUrl}/set-all-machinery`, record, {
            headers: this.accountService.bearerTokenHeader()
        });
    }

    getAllMachinery(record: { quoteOptionId: string }): Observable<IManyResponseDto<IMachineryResponse>> {
        return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/get-all-machinery`, record, {
            headers: this.accountService.bearerTokenHeader()
        });
    }
}
