import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';  
import {HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AllocationdataModel } from '../AllocationdataModel';
@Injectable({
  providedIn: 'root'
})
export class AllocateCommodityViewFrameService {
 
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
getAllocationEditdata(targetId:string)
{
  //console.log(" api data ");
  return this.http.get(this.baseURL+"set-targets/commodity-allocation/"+targetId);
  //https://scmp-settarget-service-dev.cfd.isus.emc.com/api/v1/set-targets/commodity-allocation/032420-FY21Q1-00  
}
}
