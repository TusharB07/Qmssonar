import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RiskOccupancy } from './riskOccupancyLocation';

@Injectable({
  providedIn: 'root'
})
export class RiskOccupancyLocationService {

  constructor(private http: HttpClient) { }
  getProducts() {
    return this.http
      .get<any>('assets/riskOccupancyLocation.json')
      .toPromise()
      .then((res) => <RiskOccupancy[]>res.data)
      .then((data) => {
        return data;
      });
  }
}
