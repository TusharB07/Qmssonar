import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../service/crud.service';
import { ITask } from './task.model';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService extends CrudService<ITask> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/taskRoutes`, http, accountService, { populate: [ ] })
  }

}

