import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IBscPortableEquipmentType } from './bsc-portable-equipment-type.model';

@Injectable({
    providedIn: 'root'
})
export class BscPortableEquipmentTypeService extends CrudService<IBscPortableEquipmentType>{

    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/bsc-portable-equipments-type`, http, accountService, { populate: [""] });
    }
}
