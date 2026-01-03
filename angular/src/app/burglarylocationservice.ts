import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { BurglaryLocation } from './burglarylocation'

@Injectable({
  providedIn: 'root'
})
export class BurglarylocationService {

  constructor(
    private http: HttpClient
  ) { }
  getBurglaryLocation() {
    return this.http.get<any>('assets/burglary-location.json')
    .toPromise()
    .then(res => <BurglaryLocation[]>res.data)
    .then(data => { return data; });
  }
  getMoneyInSafeTill(){
    return this.http.get<any>('assets/money-in-safe-till.json')
    .toPromise()
    .then(res => <BurglaryLocation[]>res.data)
    .then(data => { return data; })
  }
  getElectronicEquipments(){
    return this.http.get<any>('assets/electronic-equipments.json')
    .toPromise()
    .then(res => <BurglaryLocation[]>res.data)
    .then(data => { return data; })
  }
  getFixedPlateGlass(){
    return this.http.get<any>('assets/fixed-plate-glass.json')
    .toPromise()
    .then(res => <BurglaryLocation[]>res.data)
    .then(data => { return data; })
  }
  getRiskInspectionStatus(){
    return this.http.get<any>('assets/risk-inspection-status.json')
    .toPromise()
    .then(res => <BurglaryLocation[]>res.data)
    .then(data => { return data; })
  }
  // getSumInsuredSplit(){
  //   return this.http.get<any>('assets/sum-insured-split.json')
  //   .toPromise()
  //   .then(res => <BurglaryLocation[]>res.data)
  //   .then(data => { return data; })
  // }
  getSumInsuredSplit() {
    return this.http.get<any>('assets/sum-insured-split.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
    }
    getAddOns() {
      return this.http.get<any>('assets/addOns.json')
        .toPromise()
        .then(res => <BurglaryLocation[]>res.data)
        .then(data => { return data; });
      }
}
