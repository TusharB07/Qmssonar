import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { IBscAccompaniedBaggageType } from './bsc-accompanied-baggage-type.model';

@Injectable({
  providedIn: 'root'
})
export class BscAccompaniedBaggageTypeService extends CrudService<IBscAccompaniedBaggageType>{

  constructor(protected http: HttpClient, protected accountService: AccountService) {
      super(`${environment.apiUrl}/bsc-accompanied-baggage-type`, http, accountService, { populate: [""] });
  }
}
