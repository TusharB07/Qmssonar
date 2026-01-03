import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { IQuoteSlip } from 'src/app/features/admin/quote/quote.model';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { IExpiredDetails } from './expired-details-dialog-form.model';

@Injectable({
    providedIn: 'root'
})

export class ExpiredDetailsDialogFormService extends CrudService<IExpiredDetails> {
    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/expiredDetails`, http, accountService, { populate: ["quoteId", "quoteOptionId"] });
    }
}