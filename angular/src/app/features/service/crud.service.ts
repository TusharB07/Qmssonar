import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LazyLoadEvent } from "primeng/api";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ILov, IManyResponseDto, IOneResponseDto } from "../../app.model";
import { AccountService } from "../account/account.service";
import { IDiff, IDiffHistory } from "../admin/user/user.model";
import { stringify } from 'query-string';

interface CrudOptions {
  populate?: string[];
}

export abstract class CrudService<T> {
  constructor(protected baseUrl: string, protected http: HttpClient, protected accountService: AccountService, protected options?: CrudOptions) { }
  filterData:any;
  isFilterValue:any;
  // To List Records from the DB
  getMany(event: LazyLoadEvent): Observable<IManyResponseDto<T>> {
    const payload = { ...event };
    payload["populate"] = this.options?.populate;

    return this.http.post<IManyResponseDto<T>>(`${this.baseUrl}/prime`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  // To Create Single records in the DB
  create(record: T): Observable<IOneResponseDto<T>> {
    return this.http.post<IOneResponseDto<T>>(`${this.baseUrl}/`, record, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  // To Get/Read Single Records from the DB
  get(id: string, queryParams?: any): Observable<IOneResponseDto<T>> {
    // const payload = { ...event };
    // payload['populate'] = this.options?.populate;

    // console.log(stringify(queryParams))

    return this.http.get<IOneResponseDto<T>>(`${this.baseUrl}/${id}?${stringify(queryParams)}`, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  //Intergation-EB [Start]
  // To Update Single Records in the DB
  update(id, record: Partial<T>): Observable<IOneResponseDto<T>> {
    return this.http.patch<IOneResponseDto<T>>(`${this.baseUrl}/${id}`, record, { headers: this.accountService.bearerTokenHeader() });
  }
  //Intergation-EB [Start]

  // To Update Array Records in the DB
  updateArray(id, record: any): Observable<IOneResponseDto<T>> {
    return this.http.patch<IOneResponseDto<T>>(`${this.baseUrl}/${id}`, record, { headers: this.accountService.bearerTokenHeader() });
  }

  // To Delete Single Records in the DB
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  // To Delete Multiple Records from the DB
  deleteMany(ids: string[]): Observable<void> {
    const idsb64 = btoa(JSON.stringify(ids));
    return this.http.delete<void>(`${this.baseUrl}/batch-delete?ids=${idsb64}`, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  // To Get Dropdown Values
  getManyAsLovs(
    event,
    lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 200,
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        name: [
          {
            value: event.query,
            matchMode: "startsWith",
            operator: "or"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    }
  ) {
    return this.getMany(lazyLoadEvent);
  }

   // To Get Dropdown Values
   getManyAsLovsWC(
    event,
    lazyLoadEvent: LazyLoadEvent = {
      first: 0,
      rows: 999999, // Set it to a large number to retrieve all rows
      sortField: null,
      sortOrder: 1,
      filters: {
        // @ts-ignore
        name: [
          {
            value: event.query,
            matchMode: "startsWith",
            operator: "or"
          }
        ]
      },
      globalFilter: null,
      multiSortMeta: null
    }
  ) {
    return this.getMany(lazyLoadEvent);
  }

  setFilterData(data:any){
    this.filterData = data;
  }
  getFilterData(){
    return this.filterData;
  }
  setFilterValueExist(data:any){
    this.isFilterValue = data
  }
  getFilterValueExist(){
    return this.isFilterValue;
  }

}
