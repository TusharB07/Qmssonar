import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { ISequence } from './sequence.model';

@Injectable({
    providedIn: 'root'
})

export class SequenceService extends CrudService<ISequence> {


    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/sequences`, http, accountService);
    }

}
