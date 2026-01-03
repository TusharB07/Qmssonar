import { Injectable } from '@angular/core';
import { IProject } from './project-details-dialog.model';
import { CrudService } from '../../service/crud.service';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../../account/account.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsService extends CrudService<IProject> {
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/projectsMaster`, http, accountService, { populate: ["quoteId", "quoteOptionId"] });
}
}
