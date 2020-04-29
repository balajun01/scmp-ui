import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient } from '@angular/common/http';
import * as data from './allocate-commodity-view-frame/data.json';
import { Observable, of } from 'rxjs';
import { AllocationdataModel } from './AllocationdataModel';

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

getCancelCommodityAllocation(targetId:string) {
  console.log("URL "+this.baseURL + "set-targets/commodity-allocation/"+targetId);
   return this.http.get(this.baseURL + "set-targets/commodity-allocation/"+targetId);
}

saveCommodityAllocation(commodityAllocationDataModel: AllocationdataModel): Observable<any> {
  if(commodityAllocationDataModel.buAllocation.hasOwnProperty('editable')) {
    delete commodityAllocationDataModel.buAllocation['editable'];
    }
    return of(commodityAllocationDataModel);
  }
  getSavedProductGroupAllocation(targetId) {
    console.log(" frame 2 products"+ targetId+ " URL "+this.baseURL + 'set-targets/bu-allocation/' + targetId);

    return this.http.get(this.baseURL + 'set-targets/bu-allocation/' + targetId);
  }
}
