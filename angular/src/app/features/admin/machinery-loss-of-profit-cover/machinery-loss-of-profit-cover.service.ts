import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IMachineryLossOfProfitCover } from './machinery-loss-of-profit-cover.model';

@Injectable({
    providedIn: 'root'
})

export class MachineryLossOfProfitCoverService extends CrudService<IMachineryLossOfProfitCover> {


    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/machineryLossOfProfit`, http, accountService, { populate: ["quoteId"] });
    }
}
