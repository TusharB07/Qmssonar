import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IGMCTemplate } from './gmc-master-model';
import { Observable } from 'rxjs';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { LazyLoadEvent } from 'primeng/api';
//import { IGmcDataModel } from '../quote/quote.model';

@Injectable({
  providedIn: 'root'
})
//export class GmcMasterService extends CrudService<IGmcDataModel>{
  export class GmcMasterService extends CrudService<IGMCTemplate>{
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/gmcmaster`, http, accountService, { populate: ['id productId partnerId'] });
  }

  
  getPartnerwise(partnerId, productId): Observable<IOneResponseDto<IGMCTemplate>> {
    return this.http.get<IOneResponseDto<IGMCTemplate>>(`${this.baseUrl}/${partnerId}/${productId}/partnerwise`, { headers: this.accountService.bearerTokenHeader() });
  }

  getManyAsMaster(
    event,
    lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 999999, // Set it to a large number to retrieve all rows
      sortField: null,
      sortOrder: 1,
      filters: event.filters,
      globalFilter: null,
      multiSortMeta: null
    }
  ) {
    return this.getMany(lazyLoadEvent);
  }
}
