import { Component, OnInit, ViewEncapsulation, ViewChild, Output, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms'
import { SetTargetService } from 'src/app/set-target/set-target-landing/set-target.service'
import { MultiselectDropdownComponent } from 'src/app/set-target/multiselect-dropdown/multiselect-dropdown.component'
import { pairwise, startWith } from 'rxjs/operators';
import { FiscalDataDTO } from './target.model';
import { ReleaseQuarter } from './release.model';
@Component({
  selector: 'app-set-target-landing',
  templateUrl: './set-target-landing.component.html',
  styleUrls: ['./set-target-landing.component.css'],
  providers: [SetTargetService],
  encapsulation: ViewEncapsulation.None
})
export class SetTargetLandingComponent implements OnInit {

  notSelected: boolean = true;
  allocationData: any;
  commodityViewMode = false;
  commodityAllocationList: any;
  ifTabChanged = false;
  editable = true;
  editableMode = true;
  cpMonthList = [];
  selectedItems = [];
  cpSettings = {};
  quarterList = [];
  quarterSettings = {};
  enableUpdatePopUp = false;
  cpMonthRelease = false;
  targetMethodChanged = false;
  editButtonClick = false;
  isgSettings = {};
  csgSettings = {};
  updateData = false;
  targetList = [];
  quarterListFull = [];
  targetSettings = {};
  productCSGList = [];
  productISGList = [];
  quarterTab = [];
  indexOfTab = 0;
  dropDownList = {};
  productGroupCSG = [];
  updateCounter = 0;
  cpMonthId: string;
  releaseQuarter = [];
  targetMethod: string = "";
  productGroupISG = [];
  dateToPass: string;
  systemDate: string;
  targetIdForQuarters = [];
  updateClicked: boolean = false;
  targetIdQuarters: any;
  existingValue = {};
  draftModeReleaseQuarter = [];
  items: FormArray;
  previousValue = {};
  titleList = ["Set Targets", "Set Parts/CFG", "Rules", "Simulate", "Review", "Approve", "Upload"];
  @Output() public startDate: string;
  public updateAlertToChild = false;
  releaseQuarterChanged = false;
  public cpMonth: string = "";
  @Output() public endDate: string;
  @ViewChild(MultiselectDropdownComponent, { static: false }) private multiSelect: MultiselectDropdownComponent;
  cpMonthControl = new FormControl();
  targetMethodControl = new FormControl();
  releaseQuarterControl = new FormControl();
  constructor(private formBuilder: FormBuilder, private setTargetService: SetTargetService) {
  }

  ngOnInit() {
    this.systemDate = JSON.stringify(new Date()).slice(1, 11);
    this.getDropdownData();
    this.checkIfDraftModeExist();
  }


  checkIfDraftModeExist() {
    this.setTargetService.getDraftMode().subscribe(data => {
    
      this.previousValue = data;
      if (this.previousValue["status"] == 'In Progress') {
        this.updateCounter++;
        this.releaseQuarter=[];
        let pushArray = [];
        this.targetIdForQuarters = this.previousValue["targetId"];
        this.targetIdQuarters = this.targetIdForQuarters[0];

        this.cpMonth = this.previousValue["cpMonthId"].toString();
        this.cpMonthId = this.previousValue["cpMonthId"].toString();
        let prevArray = this.previousValue["releaseQuarter"];
        this.draftModeReleaseQuarter = [];
        for (let i = 0; i < prevArray.length; i++) {
          let value = {
            "releaseQuarter": prevArray[i].releaseQtr,
            "releaseQuarterId": prevArray[i].releaseQtrId,
            "checked": true,
            "disabled": false
          }
          this.releaseQuarter.push(value);
          this.draftModeReleaseQuarter.push(value);
        }
        for (let i = 0; i < this.quarterListFull.length; i++) {
          if (this.cpMonthId == this.quarterListFull[i].monthId) {
            let obj1 = {
              'releaseQuarterId': this.quarterListFull[i].releaseQuarterId,
              'releaseQuarter': this.quarterListFull[i].releaseQuarter
            }
            let obj2 = {
              'releaseQuarterId': this.quarterListFull[i].nextQuarterId,
              'releaseQuarter': this.quarterListFull[i].nextQuarter
            }
           
            pushArray.push(obj1);
            pushArray.push(obj2);
          }

        }
        for (let arr of prevArray) {
          for (let qtr of pushArray) {
            console.log("arr",arr);
            if (arr.releaseQtrId === qtr.releaseQuarterId) {
              qtr["checked"] = true;
              console.log("qtr",qtr);
            }
          }
        }
        this.quarterList = pushArray;
        console.log(" this.quarterList",this.quarterList);
        this.multiSelect.options = this.quarterList;
        this.targetMethod = this.previousValue["targetMthdId"].toString();
        this.updateClicked = true;
        this.quarterList = this.releaseQuarter;
        this.quarterTab = this.releaseQuarter;
        this.multiSelect.checkedList = this.draftModeReleaseQuarter;
        this.onTabChange(this.releaseQuarter[0].releaseQuarterId, this.targetIdForQuarters[0], 0);
      }
    });
  }

  onCpMonthSelect(item, value) {
    if (value === "first") {
      this.cpMonthId = item.target.value;
    } else {
      this.cpMonthId = item;
    }
    this.releaseQuarter = [];
    this.multiSelect.options = [];
    this.multiSelect.checkedList = [];
    for (let i = 0; i < this.quarterListFull.length; i++) {
      if (this.cpMonthId == this.quarterListFull[i].monthId) {
        let obj1 = {
          'releaseQuarterId': this.quarterListFull[i].releaseQuarterId,
          'releaseQuarter': this.quarterListFull[i].releaseQuarter
        }
        let obj2 = {
          'releaseQuarterId': this.quarterListFull[i].nextQuarterId,
          'releaseQuarter': this.quarterListFull[i].nextQuarter
        }
        let pushArray = [];
        pushArray.push(obj1);
        pushArray.push(obj2);
        this.quarterList = pushArray;
        this.multiSelect.options = this.quarterList;
      }
    }
  }

  generateTargetAllocations() {
    //this.quarterTab = [];
    this.updateCounter++;
    this.updateData = false;
    var updateObject = new FiscalDataDTO();
    updateObject.cpMonthId = this.cpMonthControl.value;
    this.cpMonthList.forEach(data => {
      if (data.cpMonthId == this.cpMonthControl.value) {
        updateObject.cpMonth = data.cpMonth;
      }
    })
    updateObject.createdBy = localStorage.getItem("user_name");
    updateObject.createdDate = '2020-03-09T10:45:24.518Z';
    updateObject.runFlag = "string";
    updateObject.runId = 0;
    updateObject.status = "string";
    updateObject.targetId = [""];
    updateObject.targetMthdId = this.targetMethodControl.value;
    this.targetList.forEach(data => {
      if (data.targetMethodId == this.targetMethodControl.value) {
        updateObject.targetMthd = data.targetMethod;
      }
    })
    updateObject.updateDate = '2020-03-09T10:45:24.518Z';
    updateObject.updatedBy = localStorage.getItem("user_name");
    updateObject.userId = 0;

    if (this.updateCounter > 1) {
      this.cpMonthRelease = false;
      this.targetMethodChanged = false;
      this.releaseQuarterChanged = false;
      if (this.previousValue["cpMonthId"].toString() !== this.cpMonthId) {
        this.cpMonthRelease = true;
      }
      if (this.releaseQuarter.length !== this.previousValue["releaseQuarter"].length) {
        this.releaseQuarterChanged = true;
      } else {
        if (this.releaseQuarter.length == 1 && this.previousValue["releaseQuarter"].length == 1) {
          if (this.releaseQuarter[0].releaseQuarterId !== this.previousValue["releaseQuarter"][0].releaseQtrId) {
            this.releaseQuarterChanged = true;
          }
        }
      }

      if (this.previousValue["targetMthdId"].toString() !== this.targetMethod) {
        this.targetMethodChanged = true;
      }
      if (this.cpMonthRelease || this.targetMethodChanged || this.releaseQuarterChanged) {
        this.enableUpdatePopUp = true;
      }
    } else {

      for (let j = 0; j < this.releaseQuarter.length; j++) {
        let value = {
          "releaseQuarterId": this.releaseQuarter[j].releaseQuarterId,
          "releaseQuarter": this.releaseQuarter[j].releaseQuarter,
          "active": j == 0 ? true : false,
          "disabled": j == 0 ? false : false
        }
        this.quarterTab.push(value);
        let releaseObj = new ReleaseQuarter();
        releaseObj.releaseQtr = this.releaseQuarter[j].releaseQuarter;
        releaseObj.releaseQtrId = this.releaseQuarter[j].releaseQuarterId;
        releaseObj.startDate = "string";
        releaseObj.endDate = "string";
        updateObject.releaseQuarter.push(releaseObj);
      }
      this.updateClicked = true;

      this.setTargetService.updateClickedData(updateObject).subscribe(data => {
        this.previousValue = data;
        this.updateData = true;
        this.targetIdForQuarters = this.previousValue["targetId"];
        this.onTabChange(this.releaseQuarter[0].releaseQuarterId, this.targetIdForQuarters[0], 0);
      }, error => {
        console.log("error", error);
      })
    }
  }
  changeCPMonth() {
    this.releaseQuarter = [];
  }
  userRequestedChange() {
    this.quarterTab = [];
    this.allocationData = [];
    this.enableUpdatePopUp = false;
    this.updateAlertToChild = true;
    var updateObject = new FiscalDataDTO();

    updateObject.cpMonthId = this.cpMonthControl.value;
    this.cpMonthList.forEach(data => {
      if (data.cpMonthId == this.cpMonthControl.value) {
        updateObject.cpMonth = data.cpMonth;
      }
    })
    updateObject.createdBy = localStorage.getItem("user_name");
    updateObject.createdDate = '2020-03-09T10:45:24.518Z';
    updateObject.runFlag = "string";
    updateObject.runId = this.previousValue["runId"];
    updateObject.status = "string";
    updateObject.targetId = this.previousValue["targetId"];
    updateObject.targetMthdId = this.targetMethodControl.value;
    this.targetList.forEach(data => {
      if (data.targetMethodId == this.targetMethodControl.value) {
        updateObject.targetMthd = data.targetMethod;
      }
    })
    updateObject.updateDate = '2020-03-09T10:45:24.518Z';
    updateObject.updatedBy = localStorage.getItem("user_name");
    updateObject.userId = 0;
    for (let j = 0; j < this.releaseQuarter.length; j++) {
      console.log("this.releaseQuarter", this.releaseQuarter);
      let value = {
        "releaseQuarterId": this.releaseQuarter[j].releaseQuarterId,
        "releaseQuarter": this.releaseQuarter[j].releaseQuarter,
        "active": j == 0 ? true : false,
        "disabled": j == 0 ? false : false
      }
      this.quarterTab.push(value);
      let releaseObj = new ReleaseQuarter();
      releaseObj.releaseQtr = this.releaseQuarter[j].releaseQuarter;
      releaseObj.releaseQtrId = this.releaseQuarter[j].releaseQuarterId;
      releaseObj.startDate = "string";
      releaseObj.endDate = "string";
      updateObject.releaseQuarter.push(releaseObj);
    }

    this.setTargetService.updateClickedData(updateObject).subscribe(data => {
      this.previousValue = data;
      this.targetIdForQuarters = this.previousValue["targetId"];
      this.onTabChange(this.releaseQuarter[0].releaseQuarterId, this.targetIdForQuarters[0], 0);

    }, error => {
      console.log("error", error);
    })
    this.updateClicked = true;
    this.editable = true;
  }

  getDropdownData() {
    this.setTargetService.getCPMonthQuarterTargetList(this.systemDate).subscribe(data => {
      this.dropDownList = data;
      this.cpMonthList = data['cpMonth'];
      this.quarterListFull = data['releaseQuarter'];
      this.targetList = data['targetMethod'];
    }, error => {
      console.log("Dropdown top three", error);
    })
  }

  retainOriginalValue() {
    this.enableUpdatePopUp = false;
    this.targetMethodChanged = false;
    this.cpMonthRelease = false;
    this.targetMethodChanged = false;
    this.updateAlertToChild = false;
    this.cpMonth = this.previousValue["cpMonthId"];
    this.cpMonthId = this.previousValue["cpMonthId"].toString();
    this.targetMethod = this.previousValue["targetMthdId"].toString();
    let checkedValueArray = [];
    this.releaseQuarter = [];
    let prevArray = this.previousValue["releaseQuarter"];
    for (let i = 0; i < prevArray.length; i++) {
      let value = {
        "releaseQuarter": prevArray[i].releaseQtr,
        "releaseQuarterId": prevArray[i].releaseQtrId
      }
      this.releaseQuarter.push(value);
      checkedValueArray.push(value);
    }

    for (let i = 0; i < this.quarterListFull.length; i++) {
      if (this.cpMonth == this.quarterListFull[i].monthId) {
        let obj1 = {
          'releaseQuarterId': this.quarterListFull[i].releaseQuarterId,
          'releaseQuarter': this.quarterListFull[i].releaseQuarter
        }
        let obj2 = {
          'releaseQuarterId': this.quarterListFull[i].nextQuarterId,
          'releaseQuarter': this.quarterListFull[i].nextQuarter
        }
        let originalQuarterList = [];

        originalQuarterList.push(obj1);
        originalQuarterList.push(obj2);
        for (let i = 0; i < checkedValueArray.length; i++) {
          for (let j = 0; j < originalQuarterList.length; j++) {
            if (checkedValueArray[i].releaseQuarterId == originalQuarterList[i].releaseQuarterId) {
              originalQuarterList[i].checked = true;
            }
          }
        }
        this.multiSelect.options = originalQuarterList;
      }
    }
    this.multiSelect.checkedList = checkedValueArray;
    this.quarterList = checkedValueArray;
  }

  showEdit(item: any) {
    console.log("edit", item);
    this.allocationData = item;
    console.log(this.allocationData);
    this.editable = this.allocationData.editable;  
    //  this.editable=item;
  }

  showCommodityEdit(item: any) {
    this.commodityAllocationList = item;
    this.editable = this.commodityAllocationList.editable;
    this.commodityViewMode = this.commodityAllocationList.commodityViewMode;
  }

  enableEditMode(item: any) {
    // this.editableMode = item;

    this.editableMode = item.editable;
    this.editButtonClick = item.editClicked;
    console.log("editableMode", this.editableMode);
  }

  changeInEditScreen(value) {
    if (this.quarterTab.length > 1) {
      if (value) {
        if (this.indexOfTab == 0) {
          this.quarterTab[1].disabled = true;
          this.quarterTab[1].active = false;
        } else {
          this.quarterTab[0].disabled = true;
          this.quarterTab[0].active = false;
        }
      } else {
        if (this.indexOfTab == 0) {
          this.quarterTab[1].disabled = false;
          this.quarterTab[1].active = false;
        } else {
          this.quarterTab[0].disabled = false;
          this.quarterTab[0].active = false;
        }
      }
    }
  }
  onTabChange(releaseQuarterId: any, targetId: any, index: number) {
    this.indexOfTab = index;
    this.targetIdQuarters = targetId;
    this.editButtonClick = false;
    this.setTargetService.getStartAndEndDate(this.systemDate, this.cpMonthId, releaseQuarterId).subscribe(data => {
      this.startDate = data['startDate'];
      this.endDate = data['endDate'];
    }, error => {
      console.log("Start and EndDate Error", error);
    })
  }
}
