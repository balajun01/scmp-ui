import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class ProductTargetService {

  baseURL = environment.baseUrl;
  constructor(private http: HttpClient) { }

getStartDateEndDate(dateToday: string) {
    return this.http.get(this.baseURL + "fiscPeriod/"+dateToday);
}

getProductList(){
  return this.http.get(this.baseURL + "product-hierarchies");
}

}
