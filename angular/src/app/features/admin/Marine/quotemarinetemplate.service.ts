import { Injectable } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IMarineTemplate } from '../quote/quote.model';

@Injectable({
  providedIn: 'root'
})
export class QuotemarinetemplateService extends CrudService<IMarineTemplate>{
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/marinedata`, http, accountService, { populate: ['id'] });
  }
}


