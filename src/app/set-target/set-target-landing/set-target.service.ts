
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient } from '@angular/common/http';
import { FiscalDataDTO } from './target.model';

@Injectable({
    providedIn: 'root'
})
export class SetTargetService {
    baseURL = environment.baseUrl;
    constructor(private http: HttpClient) { }
  

    getCPMonthQuarterTargetList(dateToday: string) {
        return this.http.get(this.baseURL + "set-targets/"+dateToday);
    }

    getStartAndEndDate(dateToday: string, cpMonthId: string, releaseQuarterId: string) {
        return this.http.get(this.baseURL + 'fiscPeriod/' + dateToday + '/' + cpMonthId + '/' + releaseQuarterId);
    }
    
    updateClickedData(fisDataDTO){
      return  this.http.post(this.baseURL+'set-targets/',fisDataDTO);
    }
    
    getDraftMode() {
        return this.http.get(this.baseURL + 'set-targets/');
      }
}

