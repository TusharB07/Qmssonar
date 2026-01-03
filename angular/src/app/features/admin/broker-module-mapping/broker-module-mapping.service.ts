import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AccountService } from "../../account/account.service";
import { environment } from "src/environments/environment";
import { CrudService } from "../../service/crud.service";
import { IBrokerModuleMapping } from "./broker-module-mapping.model";


@Injectable({
    providedIn: 'root'
})
export class BrokerModuleMappingService extends CrudService<IBrokerModuleMapping>{
    constructor(protected http: HttpClient, protected accountService: AccountService) {
        super(`${environment.apiUrl}/broker-module-mapping`, http, accountService, { populate: ['productId', 'salesCreaterId','placementMakerId','placementCheckerId'] });
    }
}