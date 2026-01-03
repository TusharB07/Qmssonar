import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IManyResponseDto, IOneResponseDto } from 'src/app/app.model';
import { AccountService } from 'src/app/features/account/account.service';
import { CrudService } from 'src/app/features/service/crud.service';
import { environment } from 'src/environments/environment';
import { IQueryManagement } from './qms.model';

@Injectable({
  providedIn: 'root'
})
export class QmsService extends CrudService<IQueryManagement> {
  constructor(protected http: HttpClient, protected accountService: AccountService) {
    super(`${environment.apiUrl}/queryManagement`, http, accountService, { populate: ["parentId"] });
  }

  getAllData(payload): Observable<IManyResponseDto<any>> {
    return this.http.post<IManyResponseDto<any>>(`${this.baseUrl}/allQueryManagements`, payload, {
      headers: this.accountService.bearerTokenHeader()
    });
  }

  updateQuery(id, payload): Observable<IOneResponseDto<any>> {
    return this.http.patch<IOneResponseDto<any>>(`${this.baseUrl}/${id}`, payload, {
      headers: this.accountService.bearerTokenHeader()
    })
  }
  locationPhotoGraphDownload(id: string, imagePath: string) {
    return this.http.get(`${this.baseUrl}/${id}/upload-location-photographs?imagePath=${imagePath}`, {
      headers: this.accountService.bearerTokenHeader(),
      observe: 'response',
      responseType: 'arraybuffer'
    });
  }

  locationPhotoGraphUpload(id: string, file: any) {
    return this.http.post(`${this.baseUrl}/${id}/upload-location-photographs`, file, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  locationPhotoGraphUploadUrl(id: string) {
    return `${this.baseUrl}/${id}/upload-location-photographs`;
  };

  locationPhotoGraphDelete(id: string, imagePath: string) {
    return this.http.delete(`${this.baseUrl}/${id}/upload-location-photographs?imagePath=${imagePath}`, {
      headers: this.accountService.bearerTokenHeader(),
    });
  }

  notificationcount(){
    return this.http.post(`${this.baseUrl}/notificationForQMS`,{},{
      headers: this.accountService.bearerTokenHeader(),
    })
  }

}
