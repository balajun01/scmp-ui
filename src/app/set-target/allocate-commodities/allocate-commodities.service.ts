import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient } from '@angular/common/http';
import * as data from './allocate-commodity-view-frame/data.json';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllocateCommoditiesService {

  data: any = (data as any).default;

  baseURL = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getAllocateBy() {
      return this.http.get(this.baseURL + "commodities/allocation-methods");
  }

  getCommodities() {
    return this.http.get(this.baseURL + "commodities");
}

getSelectType() {
  return this.http.get(this.baseURL + "commodities/allocation-types");
  
}
getBUProductItems(){
  return this.http.get(this.baseURL);
}

getCommodityAllocation() {
  return of(data);
}

saveCommodityAllocation(): Observable<any> {
  return of(data);
}
}
