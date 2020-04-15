import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ProductGroupEditFrameService } from '../product-group-edit-frame/product-group-edit-frame.service';

@Component({
  selector: 'app-product-group-view-frame',
  templateUrl: './product-group-view-frame.component.html',
  styleUrls: ['./product-group-view-frame.component.css']
})
export class ProductGroupViewFrameComponent implements OnInit {

  @Output() editEvent = new EventEmitter<any>();
  @Output() editTabSwitch = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<any>();
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() quarter: string;
  @Input() allocationData: any;
  savedProductGroupAllocationData: any;
  productGroupCSG = [];
  productGroupISG = [];
  totalAllocation = 0
  totalCSGAllocation = 0;
  totalISGAllocation = 0;
  editable: boolean;
  @Input() targetIdQuarter: any;

  constructor(private productGroupEditFrameService: ProductGroupEditFrameService) {
  }
  ngOnInit() {
    setTimeout(() => {
      this.productGroupEditFrameService.getSavedProductGroupAllocation(this.targetIdQuarter).subscribe(data => {
        this.savedProductGroupAllocationData = data;
        console.log("  this.savedProductGroupAllocationData", this.savedProductGroupAllocationData);
        if (this.savedProductGroupAllocationData.length > 0) {

          let obj = {
            "editClicked": false,
            "editable": false
          }
          this.editTabSwitch.emit(obj);
          this.valueChange.emit(false);
          for (let productGroup of this.savedProductGroupAllocationData) {
            if (productGroup.prodBuDesc === 'CSG') {
              productGroup.prodGrpDescSplit = productGroup.prodGrpDesc.split('  ').join('\n');
            
              this.productGroupCSG.push(productGroup);
            } else if(productGroup.prodBuDesc === 'ISG'){
              productGroup.prodGrpDescSplit = productGroup.prodGrpDesc.split('  ').join('\n');
              this.productGroupISG.push(productGroup);
            }
          }
          if (this.productGroupCSG.length > 0) {
            this.totalCSGAllocation = this.productGroupCSG[0].buTotal;
            this.totalAllocation = this.productGroupCSG[0].total;
          } else {
            this.totalAllocation = this.productGroupISG[0].total;
          }
          if (this.productGroupISG.length > 0) {
            this.totalISGAllocation = this.productGroupISG[0].buTotal;
          }
        } else {
          let obj = {
            "editClicked": false,
            "editable": true
          }
          this.editTabSwitch.emit(obj);
        }
      })
    }, 400);
  }

  onEdit(data: any) {
    data.editable = true;
    this.editEvent.emit(data);
    let obj = {
      "editClicked": true,
      "editable": true
    }
    this.editTabSwitch.emit(obj);

  }

}
