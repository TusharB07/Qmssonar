import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CrudService } from "src/app/features/service/crud.service";
import { environment } from "src/environments/environment";
import { AccountService } from "../../account/account.service";
import { IAddOnsCoverOptions } from "./add-ons-covers-ddl-options.model";
import { IBulkImportResponseDto, ILov, IOneResponseDto, PFileUploadGetterProps } from "src/app/app.model";
import { LazyLoadEvent } from "primeng/api";
import { ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AddOnCoverOptionsService extends CrudService<IAddOnsCoverOptions> {

  routeSource = new ReplaySubject<string>();
  routeSource$ = this.routeSource.asObservable();
  
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/addOnCoverOptions`, http, accountService);
  }

  async searchOptionsAddOnCovers(event?: any): Promise<ILov[]> {

    let optionsAddonCovers: ILov[] = []

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

    optionsAddonCovers = response.data.entities.map((type) => ({ label: type.optionName, value: type._id }))

    return optionsAddonCovers
}

  // Bulk Import ------------------------------------------------------------------------------------------
  bulkImportGenerateSample(payload :any) {
    return this.http.post<IOneResponseDto<IBulkImportResponseDto>>(`${this.baseUrl}/bulk-import-generate-sample`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

getBulkImportProps(onUpload: (dto: IOneResponseDto<IBulkImportResponseDto>) => void): PFileUploadGetterProps {
  return {
    name: 'bulk_import',
    url: `${this.baseUrl}/bulk-import`,
    mode: "basic",
    headers: this.accountService.bearerTokenHeader(),
    accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, application/wps-office.xlsx',
    maxFileSize: 1000000,
    method: 'post',
    onUpload: onUpload,
    auto: true,
    // uploadLabel: "Bulk Import ",
    chooseLabel: "Bulk Import Excel Upload",
  }
}
}
