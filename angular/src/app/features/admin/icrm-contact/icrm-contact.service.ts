import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IICRMContact } from './icrm-contact.model';

@Injectable({
    providedIn: 'root'
})
export class IcrmContactService extends CrudService<IICRMContact> {

    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/icRmContacts`, http, accountService, { populate: ['icPartnerId'] });
    }
}
