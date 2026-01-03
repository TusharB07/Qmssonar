import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { ICoverageType } from './coveragetypes.model';

@Injectable({
  providedIn: 'root'
})
export class CoverageTypesService extends CrudService<ICoverageType> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/coveragetypes`, http, accountService)
  }
}
