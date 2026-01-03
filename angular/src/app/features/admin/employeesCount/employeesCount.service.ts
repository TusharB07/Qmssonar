import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';
import { CrudService } from '../../service/crud.service';
import { IemployeesCount } from './employeesCount..model';

@Injectable({
  providedIn: 'root'
})
export class employeesCountService extends CrudService<IemployeesCount> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/employeesCounts`, http, accountService)
  }
}
