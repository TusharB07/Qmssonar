import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CrudService } from '../../service/crud.service';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../../account/account.service';
import { ITaskQueue } from './task-queue.model';

@Injectable({
  providedIn: 'root'
})
export class TaskQueueService extends CrudService<ITaskQueue> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/taskQueueRoutes`, http, accountService, { populate: [ ] })
  }

}

