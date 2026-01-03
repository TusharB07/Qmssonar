import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../../account/account.service';
import { CrudService } from '../../../service/crud.service';
import { IPackaging } from './packaging.model';
import { LazyLoadEvent } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class PackagingService extends CrudService<IPackaging> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/packagingMaster`, http, accountService)
  }

  async searchOptionsPackagings(event?: any): Promise<ILov[]> {

    let optionsPackagings: ILov[] = []

    let lazyLoadEvent: LazyLoadEvent = {
        first: 0,
        rows: 200,
        sortField: null,
        sortOrder: 1,
        filters: {
            // @ts-ignore
            type: [
                {
                    value: event?.query,
                    matchMode: "startsWith",
                    operator: "or"
                }
            ]
        },
        globalFilter: null,
        multiSortMeta: null
    }
  
    const response = await this.getMany(lazyLoadEvent).toPromise()

    optionsPackagings = response.data.entities.map((type) => ({ label: type.packaging, value: type._id }))

    return optionsPackagings
}
}
