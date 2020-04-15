import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProductGroupAllocation } from '../product-group-allocation';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupEditFrameService {
  baseURL = environment.baseUrl;
  constructor(private http: HttpClient) {
  }
  getStartDateEndDate(dateToday: string) {
    return this.http.get(this.baseURL + 'fiscPeriod/' + dateToday);
  }
  getProductList() {
    return this.http.get(this.baseURL + 'product-hierarchies');
  }
  updateproductGroupData(allocatedDataList: ProductGroupAllocation[]) {
    return this.http.post(this.baseURL + 'set-targets/saves/bu-allocation', allocatedDataList);
  }
  getSavedProductGroupAllocation(targetId) {
    return this.http.get(this.baseURL + 'set-targets/bu-allocation/' + targetId);
  }
}
