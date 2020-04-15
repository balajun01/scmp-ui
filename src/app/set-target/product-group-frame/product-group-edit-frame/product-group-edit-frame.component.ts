import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, AfterViewChecked, ChangeDetectorRef, ViewChildren, ElementRef, QueryList, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, NgForm } from '@angular/forms';
import { ProductGroupEditFrameService } from 'src/app/set-target/product-group-frame/product-group-edit-frame/product-group-edit-frame.service';
import { SetTargetService } from 'src/app/set-target/set-target-landing/set-target.service';
import { ProductTargetService } from '../product-target.service';
import { ProductGroupAllocation } from '../product-group-allocation';

@Component({
  selector: 'app-product-group-edit-frame',
  templateUrl: './product-group-edit-frame.component.html',
  styleUrls: ['./product-group-edit-frame.component.css'],
  providers: [ProductGroupEditFrameService, SetTargetService],
  encapsulation: ViewEncapsulation.None
})

export class ProductGroupEditFrameComponent implements OnInit, OnChanges {
  @Input() quarter: string;
  @Input() quarterId: number;
  @Input() editButtonClick;
  @Output() editEvent = new EventEmitter<any>();
  @Output() editTabSwitch = new EventEmitter<any>();
  @Output() initialTabLoad = new EventEmitter<any>();
  @Output() valueChange = new EventEmitter<any>();
  @Input() startDate: string;
  @Input() endDate: string;
  @Input() allocationData: any;
  @Input() targetIdQuarter: any;
  editable = false;
  dateList: {};
  notSelected = true;
  cpMonthList = [];
  isgNoRowAdded = true;
  csgNoRowAdded = true;
  selectedItems = [];
  cpSettings = {};
  quarterList = [];
  quarterSettings = {};
  isgSettings = {};
  csgSettings = {};
  targetList = [];
  quarterListFull = [];
  targetSettings = {};
  productCSGList = [];
  productISGList = [];
  dropDownList = {};
  productCSGCheckCounter = 0;
  productISGCheckCounter = 0;
  productGroupCSG = [];
  productGroupISG = [];
  dateToPass: string;
  updateClicked = false;
  allocationValue: string;
  allocation: string;
  items: FormArray;
  totalAllocation = 0;
  public CSGProductForm: FormGroup;
  public ISGProductForm: FormGroup;
  cancelModalMessage = 'Are you sure you want to cancel it ?';
  isCancel = true;
  productCSGOriginal = [];
  productISGOriginal = [];
  isCancelModalOpened = false;
  totalCSGallocation = 0;
  totalISGallocation = 0;
  @Input() updateAlertToChild;
  savedProductGroupAllocationData: any;
  constructor(private formBuilder: FormBuilder,
    private productTarget: ProductTargetService,
    private productGroupEditFrameService: ProductGroupEditFrameService,
    private setTargetService: SetTargetService, private ref: ChangeDetectorRef) {
  }

  csgIsgSettings = {
    singleSelection: false,
    idField: 'prodGroupId',
    textField: 'prodGroupDescp',
    enableCheckAll: false,
    itemsShowLimit: 1,
    allowSearchFilter: false
  };


  ngOnInit() {
    this.populateProductGroup();
    this.createProductForm();

    setTimeout(() => {
      this.productGroupEditFrameService.getSavedProductGroupAllocation(this.targetIdQuarter).subscribe(data => {
        this.savedProductGroupAllocationData = data;
        if (this.savedProductGroupAllocationData !== null && this.savedProductGroupAllocationData.length > 0) {
          if (this.editButtonClick) {
            for (let productGroup of this.savedProductGroupAllocationData) {
              if (productGroup.prodBuDesc === 'CSG') {
                this.productGroupCSG.push(productGroup);
              } else if(productGroup.prodBuDesc === 'ISG') {
                this.productGroupISG.push(productGroup);
              }
            }
            this.populateProductGroupAllocationOnEdit(this.savedProductGroupAllocationData);
          } else {
            let obj = {
              "editClicked": false,
              "editable": false
            }
            this.editTabSwitch.emit(obj);
          }
        }
      })
    }, 500);
  }

  ngOnChanges() {
    if (this.updateAlertToChild) {
      this.totalAllocation = 0;
      this.totalCSGallocation = 0;
      this.totalISGallocation = 0;
      this.productISGCheckCounter = 0;
      this.productISGCheckCounter = 0;
      this.isCancel = true;
      this.productCSGList.forEach(data => {
        data.checked = false;
        data.isDisabled = false;
      })

      this.productISGList.forEach(data => {
        data.checked = false;
        data.isDisabled = false;
      })

      if (this.CSGProductForm !== undefined) {
        if (this.CSGArr !== undefined) {
          while (this.CSGArr.value.length > 0) {
            this.CSGArr.removeAt(0);
          }
        }
      }
      if (this.ISGProductForm !== undefined) {
        if (this.ISGArr !== undefined) {
          while (this.ISGArr.value.length > 0) {
            this.ISGArr.removeAt(0);
          }
        }
      }
      this.isgNoRowAdded = true;
      this.csgNoRowAdded = true;
    }
  }

  cancelBuProductChange(isBuProductChanged: boolean) {
    this.isCancelModalOpened = false;
    if (isBuProductChanged) {
      this.valueChange.emit(false);
      if (this.savedProductGroupAllocationData === undefined || this.savedProductGroupAllocationData.length == 0) {
        this.totalCSGallocation = 0;
        this.totalISGallocation = 0;
        this.totalAllocation = 0;
        this.productISGCheckCounter = 0;
        this.productCSGCheckCounter = 0;
        this.isCancel = true;
        this.productCSGList.forEach(data => {
          data.checked = false;
          data.isDisabled = false;
        })
        this.productISGList.forEach(data => {
          data.checked = false;
          data.isDisabled = false;
        })

        if (this.CSGArr !== undefined) {
          while (this.CSGArr.length > 0) {
            this.CSGArr.removeAt(0);
          }
        }
        if (this.ISGArr !== undefined) {
          while (this.ISGArr.length > 0) {
            this.ISGArr.removeAt(0);
          }
        }
        this.csgNoRowAdded = true;
        this.isgNoRowAdded = true;
      } else {
        this.allocationData['editable'] = false;
        this.editEvent.emit(this.allocationData);
        let obj = {
          "editClicked": false,
          "editable": false
        }
        this.editTabSwitch.emit(obj);

      }
    } else if (this.CSGArr.length === 0 && this.ISGArr.length === 0) {
      this.isCancel = true;
    }

  }

  cancelProductForm() {
    this.isCancelModalOpened = true;
  }
  onISGSelect(item) {
    for (let isg of this.productISGList) {
      if (isg.prodGroupId == item.prodGroupId) {
        isg.checked = true;
        isg.isDisabled = true;
        this.productISGCheckCounter++;
        break;
      }
    }
  }

  onISGDeselect(item) {
    for (let isg of this.productISGList) {
      if (isg.prodGroupId == item.prodGroupId) {
        isg.checked = false;
        isg.isDisabled = false;
        this.productISGCheckCounter--;
        break;
      }
    }
  }

  onCSGSelect(item) {
    for (let csg of this.productCSGList) {
      if (csg.prodGroupId == item.prodGroupId) {
        csg.checked = true;
        csg.isDisabled = true;
        this.productCSGCheckCounter++;
        break;
      }
    }
  }

  onCSGDeselect(item) {
    for (let csg of this.productCSGList) {
      if (csg.prodGroupId == item.prodGroupId) {
        csg.checked = false;
        csg.isDisabled = false;
        this.productCSGCheckCounter++;
        break;
      }
    }
  }

  createProductForm() {
    this.CSGProductForm = this.formBuilder.group({
      cSGRows: this.formBuilder.array([])
    });
    this.ISGProductForm = this.formBuilder.group({
      iSGRows: this.formBuilder.array([])
    });
  }

  get CSGArr() {
    return this.CSGProductForm.get('cSGRows') as FormArray;

  }

  get ISGArr() {
    return this.ISGProductForm.get('iSGRows') as FormArray;
  }

  initCSGRows() {
    return this.formBuilder.group({
      productCSG: ['', [Validators.required]],
      CSGAllocation: ['', [Validators.required]]
    });
  }

  initISGRows() {
    return this.formBuilder.group({
      productISG: ['', [Validators.required]],
      ISGAllocation: ['', [Validators.required]]
    });
  }

  addCSGRow() {
    this.csgNoRowAdded = false;
    this.valueChange.emit(true);
    this.CSGArr.push(this.initCSGRows());
    this.isCancel = false;
  }

  onCSGChange(index, value) {
    this.CSGArr.value[index].CSGAllocation = value;
    this.totalCSGallocation = 0;
    this.totalAllocation = 0;
    this.valueChange.emit(true);
    this.CSGArr.value.forEach(element => {
      let number = parseFloat(parseFloat(element.CSGAllocation).toFixed(4));
      if (!Number.isNaN(number)) {
        this.totalCSGallocation = this.totalCSGallocation + number;
      }

    });
    this.totalCSGallocation = parseFloat(this.totalCSGallocation.toFixed(4));
    this.totalAllocation = this.totalISGallocation + this.totalCSGallocation;
    this.totalAllocation = parseFloat(this.totalAllocation.toFixed(4));
  }

  onISGChange(index, value) {
    this.ISGArr.value[index].ISGAllocation = value;
    this.totalAllocation = 0;
    this.totalISGallocation = 0;
    this.valueChange.emit(true);
    this.ISGArr.value.forEach(element => {
      let num = parseFloat(parseFloat(element.ISGAllocation).toFixed(4));
      if (!Number.isNaN(num)) {
        this.totalISGallocation = this.totalISGallocation + num;
      }
    });
    this.totalISGallocation = parseFloat(this.totalISGallocation.toFixed(4));
    this.totalAllocation = this.totalCSGallocation + this.totalISGallocation;
    this.totalAllocation = parseFloat(this.totalAllocation.toFixed(4));
  }

  addISGRow() {
    this.isgNoRowAdded = false;
    this.valueChange.emit(true);
    this.ISGArr.push(this.initISGRows());
    this.isCancel = false;
  }

  deleteCSGRow(index: number) {
    if (this.CSGArr.length == 1) {
      this.csgNoRowAdded = true;
      if (this.editButtonClick) {
        this.valueChange.emit(true);
      } else {
        this.valueChange.emit(false);
      }
    } else {
      this.valueChange.emit(true);
    }
    var tempCSG = this.CSGArr.value[index].productCSG;
    var csgAllocation = this.CSGArr.value[index].CSGAllocation;
    this.CSGArr.removeAt(index);
    if (this.CSGArr.length === 0 && this.ISGArr.length === 0) {
      if (this.editButtonClick) {
        this.isCancel = false;
      } else {
        this.isCancel = true;
      }
    }

    if (tempCSG !== null || tempCSG.length > 0) {
      for (let temp of tempCSG) {
        for (let csg of this.productCSGList) {
          if (temp.prodGroupId == csg.prodGroupId) {
            csg.checked = false;
            csg.isDisabled = false;
            this.productCSGCheckCounter--;
            break;
          }
        }
      }
    }
    this.CSGProductForm.markAsDirty();
    this.totalAllocation = this.totalAllocation - csgAllocation;
    this.totalAllocation = parseFloat(this.totalAllocation.toFixed(4));
    this.totalCSGallocation = this.totalCSGallocation - csgAllocation;
    this.totalCSGallocation = parseFloat(this.totalCSGallocation.toFixed(4));
  }

  deleteISGRow(index: number) {
    if (this.ISGArr.length == 1) {
      this.isgNoRowAdded = true;
      if (this.editButtonClick) {
        this.valueChange.emit(true);
      } else {
        this.valueChange.emit(false);
      }
    } else {
      this.valueChange.emit(true);
    }
    var tempISG = this.ISGArr.value[index].productISG;
    var isgAllocation = this.ISGArr.value[index].ISGAllocation;
    this.ISGArr.removeAt(index);
    if (this.CSGArr.length === 0 && this.ISGArr.length === 0) {
      if (this.editButtonClick) {
        this.isCancel = false;
      } else {
        this.isCancel = true;
      }
    }

    if (tempISG !== null || tempISG.length > 0) {
      for (let temp of tempISG) {
        for (let isg of this.productISGList) {
          if (temp.prodGroupId == isg.prodGroupId) {
            isg.checked = false;
            isg.isDisabled = false;
            this.productISGCheckCounter++;
            break;
          }
        }
      }
    }
    this.ISGProductForm.markAsDirty();
    this.totalAllocation = this.totalAllocation - isgAllocation;
    this.totalAllocation = parseFloat(this.totalAllocation.toFixed(4));
    this.totalISGallocation = this.totalISGallocation - isgAllocation;
    this.totalISGallocation = parseFloat(this.totalISGallocation.toFixed(4));
  }

  generateTargetAllocations() {
    this.notSelected = false;
    this.updateClicked = true;
  }

  saveProductGroupAllocation(editable: boolean) {
    let allocatedDataList = [];
    let productGroupAllocation: ProductGroupAllocation;
    let productGroupAlloc: ProductGroupAllocation;
    if (this.CSGArr.value.length > 0) {
      for (let CSGObj of this.CSGArr.value) {
        productGroupAllocation = new ProductGroupAllocation();
        productGroupAllocation.allocateBuId = 0;
        productGroupAllocation.amountAllocated = CSGObj.CSGAllocation;
        productGroupAllocation.prodBuId = "2CP";
        productGroupAllocation.prodBuDesc = "CSG";
        productGroupAllocation.createdDate = "2020-03-09T11:39:54.947Z";
        productGroupAllocation.updatedDate = "2020-03-09T11:39:54.947Z";
        productGroupAllocation.releaseQtr = this.quarter;
        productGroupAllocation.releaseQtrId = this.quarterId;
        productGroupAllocation.targetId = this.targetIdQuarter;
        productGroupAllocation.status = 'Draft';
        productGroupAllocation.buTotal = this.totalCSGallocation;
        productGroupAllocation.total = this.totalAllocation;

        let prodGrpIdArray = [];
        let prodGrpDescArray = [];
        for (const prodGrp of CSGObj.productCSG) {
          prodGrpIdArray.push(prodGrp.prodGroupId);
          prodGrpDescArray.push(prodGrp.prodGroupDescp);
        }
        productGroupAllocation.prodGrpId = prodGrpIdArray.join(',');
        productGroupAllocation.prodGrpDesc = prodGrpDescArray.join(',  ');
        allocatedDataList.push(productGroupAllocation);
      }
    }
    if (this.ISGArr.value.length > 0) {
      for (let ISGObj of this.ISGArr.value) {
        productGroupAllocation = new ProductGroupAllocation();
        productGroupAllocation.allocateBuId = 0;
        productGroupAllocation.amountAllocated = ISGObj.ISGAllocation;
        productGroupAllocation.prodBuId = "2ES";
        productGroupAllocation.prodBuDesc = "ISG";
        productGroupAllocation.createdDate = "";
        productGroupAllocation.updatedDate = "";
        productGroupAllocation.releaseQtr = this.quarter;
        productGroupAllocation.releaseQtrId = this.quarterId;
        productGroupAllocation.targetId = this.targetIdQuarter;
        productGroupAllocation.status = 'Draft';
        productGroupAllocation.buTotal = this.totalISGallocation;
        productGroupAllocation.total = this.totalAllocation;
        let prodGrpIdArray = [];
        let prodGrpDescArray = [];
        for (const prodGrp of ISGObj.productISG) {
          prodGrpIdArray.push(prodGrp.prodGroupId);
          prodGrpDescArray.push(prodGrp.prodGroupDescp);
        }
        productGroupAllocation.prodGrpId = prodGrpIdArray.join(',');
        productGroupAllocation.prodGrpDesc = prodGrpDescArray.join(',  ');
        allocatedDataList.push(productGroupAllocation);
      }
    }
    if(this.CSGArr.value.length==0 && this.ISGArr.value.length==0){
      productGroupAlloc = new ProductGroupAllocation();
      productGroupAlloc.allocateBuId = 0;
      productGroupAlloc.amountAllocated = 0;
      productGroupAlloc.prodBuId = "";
      productGroupAlloc.prodBuDesc = "";
      productGroupAlloc.createdDate = "2020-03-09T11:39:54.947Z";
      productGroupAlloc.updatedDate = "2020-03-09T11:39:54.947Z";
      productGroupAlloc.releaseQtr = "";
      productGroupAlloc.releaseQtrId = 0;
      productGroupAlloc.targetId = this.targetIdQuarter;
      productGroupAlloc.status = 'Draft';
      productGroupAlloc.buTotal = 0;
      productGroupAlloc.total = 0;
      productGroupAlloc.prodGrpId = "";
      productGroupAlloc.prodGrpDesc = "";
      allocatedDataList.push(productGroupAlloc);
    }
    console.log("allocatedDataList",allocatedDataList);
    this.productGroupEditFrameService.updateproductGroupData(allocatedDataList)
      .subscribe(data => {
        data['editable'] = editable;
        this.editEvent.emit(data);
        let obj = {
          "editClicked": false,
          "editable": false
        }
        this.editTabSwitch.emit(obj);
      }, error => {
        let obj = {
          "editClicked": false,
          "editable": true
        }
        this.editTabSwitch.emit(obj);
        this.editable = true;
        console.log('Save API Error --- ', error);
      });
  }

  populateProductGroup() {
    this.productTarget.getProductList().subscribe(data => {

      this.productCSGList = data['productCSG'];
      this.productISGList = data['productISG'];

      for (let csg of this.productCSGList) {
        csg.checked = false;
        csg.isDisabled = false;
      }
      for (let isg of this.productISGList) {
        isg.checked = false;
        isg.isDisabled = false;
      }
    }, error => {
      console.log("Product Group List", error);
    })
  }

  populateStartDate() {
    let date = new Date();
    var month = date.getMonth() + 1;
    var datePass = date.getFullYear() + "-" + month + "-" + date.getDate();
  }

  //Edit Mode Method 
  populateProductGroupAllocationOnEdit(savedData) {
    this.isCancel = false;
    this.isgNoRowAdded = false;
    this.csgNoRowAdded = false;
    let i = 0;
    let j = 0;

    savedData.forEach((element, index) => {

      if (element.prodBuDesc === 'CSG') {
        this.totalAllocation = element.total;
        this.totalCSGallocation = element.buTotal;
        //prodGrpId coming from DB
        let elementArray = element.prodGrpId.split(',');
        let productGroupTemp = [];
        for (let element of elementArray) {
          for (let csg of this.productCSGList) {
            if (element == csg.prodGroupId) {
              let csgTemp = {
                "prodGroupId": csg.prodGroupId,
                "prodGroupDescp": csg.prodGroupDescp,
                "prodBuId": csg.prodBuId,
                "prodBuDesc": csg.prodBuDesc
              }
              productGroupTemp.push(csgTemp);
            }
            if (element == csg.prodGroupId) {
              csg.checked = true;
              csg.isDisabled = true;
              this.productCSGCheckCounter++;
              break;
            }
          }
        }

        const control = this.formBuilder.group({
          productCSG: [productGroupTemp, [Validators.required]],
          CSGAllocation: [element.amountAllocated, [Validators.required]]
        });
        this.CSGArr.push(control);
        i++;
      }

      if (element.prodBuDesc === 'ISG') {
        this.totalISGallocation = element.buTotal;

        if (this.CSGArr === undefined || this.CSGArr.value.length == 0) {
          this.totalAllocation = element.total;
        }
        let elementArray = element.prodGrpId.split(',');
        let productGroupTemp = [];
        for (let val of elementArray) {
          for (let ele of this.productISGList) {
            if (val === ele.prodGroupId) {
              let isgTemp = {
                "prodGroupId": ele.prodGroupId,
                "prodGroupDescp": ele.prodGroupDescp,
                "prodBuId": ele.prodBuId,
                "prodBuDesc": ele.prodBuDesc

              }
              productGroupTemp.push(isgTemp);
            }
            if (val === ele.prodGroupId) {
              ele.checked = true;
              ele.isDisabled = true;
              this.productISGCheckCounter++;
              break;
            }
          }
        }
        const control = this.formBuilder.group({
          productISG: [productGroupTemp, [Validators.required]],
          ISGAllocation: [element.amountAllocated, [Validators.required]]
        });
        this.ISGArr.push(control);
        j++;
      }
    });

    if (this.ISGArr === undefined || this.ISGArr.value.length == 0) {
      this.isgNoRowAdded = true;
    }

    if (this.CSGArr === undefined || this.CSGArr.value.length == 0) {
      this.csgNoRowAdded = true;
    }
  }
}



