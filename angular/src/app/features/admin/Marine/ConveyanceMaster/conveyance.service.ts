import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILov, IOneResponseDto } from 'src/app/app.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../../account/account.service';
import { CrudService } from '../../../service/crud.service';
import { IConveyance } from './conveyance.model';
import { LazyLoadEvent } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConveyanceService extends CrudService<IConveyance> {

  constructor( protected http: HttpClient, protected  accountService: AccountService) { 
    super(`${environment.apiUrl}/conveyanceMaster`, http, accountService)
  }

  async searchOptionsConveyances(event?: any): Promise<ILov[]> {

    let optionsConveyances: ILov[] = []

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

    optionsConveyances = response.data.entities.map((type) => ({ label: type.conveyance, value: type._id }))

    return optionsConveyances
}
}
