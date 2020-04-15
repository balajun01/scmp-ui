import { Component, OnInit, ViewEncapsulation, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms'
import { MultiselectDropdownComponent } from 'src/app/set-target/multiselect-dropdown/multiselect-dropdown.component'
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatDividerModule} from '@angular/material/divider';
import { SetTargetService } from 'src/app/set-target/set-target-landing/set-target.service'
import { AllocateCommoditiesService } from 'src/app/set-target/allocate-commodities/allocate-commodities.service'
import{ AllocationdataModel, BUAllocation, CommodityAllocation, Commodity, Allocation } from 'src/app/set-target/allocate-commodities/AllocationdataModel';
import * as data from './allocate-commodity-view-frame/data.json';
import { error } from '@angular/compiler/src/util';


@Component({
  selector: 'app-allocate-commodities',
  templateUrl: './allocate-commodities.component.html',
  styleUrls: ['./allocate-commodities.component.css'],
  providers: [AllocateCommoditiesService],
  encapsulation: ViewEncapsulation.None
})
export class AllocateCommoditiesComponent implements OnInit {
 
  commoditySettings = {};
  
  commodity =[];
  commodityControl = new FormControl();
  commodityList:any=[];
  // simTypeList=['Non Simulate', 'Simulate'] ;
  simTypeList =[];
  allocateByList = [];
  simType;
  allocate;
  allocateType="$M"; 
  display:boolean=false;
  buprodctinfo:any;
  selectedsimtype:any;
  selectedsimtypelist:any=[];  
  @Input() allocationData: any=[];  
  @Output() editEvent = new EventEmitter<any>();
  @Input() commodityAllocationList: any;
  selectedcommoditylist:any=[];
  trdisplaylist:number=0;
  disabled:boolean=false;
  firstselectedcommoditylist:any=[];
  secondselectedcommoditylist:any=[];
  firstselectedsimtype:any;
  secondselectedsimtype:any;
  commodityrowtotal:number=0; 
  commoditycoltotal:number=0;
  commodityrowcoltotallist:any=[];
   displayallocate:boolean=true;
   _allocationDataModel:AllocationdataModel;
    _buallocation:BUAllocation[]=[];
    _commodityallocation:CommodityAllocation[]=[];
    _commoditymodellist:Commodity[]=[];
    _allocation:Allocation[]=[];
   _commoditymodellist2:Commodity[]=[];
   numberarray:number[]=[];
  isCancel = true;
  isCancelModalOpened = false;
  cancelModalMessage = 'Are you sure you want to cancel it ?';
  

  constructor(private formBuilder: FormBuilder, private allocateCommoditiesService: AllocateCommoditiesService) { }

  ngOnInit() {
    this.getSelectType();
     this.getCommodities();
     this.getAllocateBy();
      ////console.log("  test model: "+ JSON.stringify(this._allocationDataModel));
     ////console.log(this.allocationData);
     if(this.allocationData){
      let totalamountallocated:number=0;
    for(let i in this.allocationData){
      this._buallocation[i]=new BUAllocation(this.allocationData[i].prodBuId,this.allocationData[i].prodBuDesc,this.allocationData[i].prodGrpId,this.allocationData[i].prodGrpDesc,this.allocationData[i].amountAllocated);
      totalamountallocated=(totalamountallocated*1)+((this.allocationData[i].amountAllocated)*1);
      ////console.log("totalamountallocated"+totalamountallocated);
    }
    this._buallocation[this._buallocation.length]=new BUAllocation(0, "Total",0,"",totalamountallocated);
    this._allocationDataModel=new AllocationdataModel(this._buallocation,this._commodityallocation);
     ////console.log("  test model: "+ JSON.stringify(this._allocationDataModel));
    }
    this.commoditySettings = {
      singleSelection: false,
       idField: 'commodityId',
       textField: 'commodityDesc',       
      enableCheckAll: false,
      itemsShowLimit: 2,
      allowSearchFilter: true,
      searchPlaceholderText:"Search keyword...",    

    }
////console.log(" commodity settings: "+this.commoditySettings);
    
  }
  getAllocateBy() {
    this.allocateCommoditiesService.getAllocateBy().subscribe((data:any)=>{ 
      this.allocateByList=data;

    ////console.log("Allocate by list ", this.allocateByList);
  }, error =>{
    ////console.log(" error : ", error);
  }
    )
  }
  getCommodities() {
    this.allocateCommoditiesService.getCommodities().subscribe((data:any)=>{ 
      this.commodityList=data;      
       ////console.log("commodity list ", this.commodityList);      
      
       if(this.commodity && this.commodity.length>0)
       {            
        for(let x in this.firstselectedcommoditylist){
          for(let y in this.commodityList){
            if(this.firstselectedcommoditylist[x].commodityDesc==this.commodityList[y].commodityDesc){
              this.commodityList[y].isDisabled=true;
              this.commodityList[y].checked=true; 
            }
          }     
        }
        for(let x in this.secondselectedcommoditylist){
          for(let y in this.commodityList){
            if(this.secondselectedcommoditylist[x].commodityDesc==this.commodityList[y].commodityDesc){
              this.commodityList[y].isDisabled=true;
              this.commodityList[y].checked=true; 
            }
          }     
        }
        this.commodity=[];
       }
       
  }, error =>{
    ////console.log(" error : ", error);
  }
    )
  }
  getSelectType() {

    this.allocateCommoditiesService.getSelectType().subscribe((data:any)=>{ 
      this.simTypeList=data;
    ////console.log("sim type list ", this.simTypeList);
  }, error =>{
    ////console.log(" error : ", error);
  }
    )
  }
  
  onallocateBySelect(item){    
    ////console.log(" selcted value is ",this.allocateType);
    if(item.target.value=="$M"){
      this.displayallocate=false;
    }
    else
    this.displayallocate=true;
  }  

  onCommoditySelect(item) {
   
    ////console.log("selected item:"+JSON.stringify(item));    
    // this.commodity.push(item);
    ////console.log(this.commodity);    
  }

  deletecommodity(event,ecommodityid,allocatetype){
   
  // this._commoditymodellist
  let item1 = this._commoditymodellist.find(i => i.commodityGrpId=== ecommodityid);
  let index = this._commoditymodellist.findIndex(i => i.commodityGrpId=== ecommodityid);
    ////console.log("deletecommodity clicked"+event.target.value+ecommodityid+allocatetype+ item1+index);
  }

  addCommodityRows(){
  
    let rowtotal= {"allocation":0,"target":0}
        /*  Start Code for assigning data to allocationdatamodel */   
    if(this.commodity.length>0 && this.simType.length>0){
      if(this.firstselectedsimtype && this.firstselectedsimtype !== this.simType.split(",",2)[1] )
      {
        if(this.secondselectedsimtype && this.secondselectedsimtype==this.simType.split(",",2)[1] )
        {
          let cnt:number=0;
          for(let x in this.commodity)
          {       
            for(let y in this._buallocation)
            {
              this._allocation[y]=(new Allocation(0,0));
            }
         
            this._commoditymodellist2[((this._commoditymodellist2.length-1)*1)+(cnt*1)]=new Commodity( this.commodity[x].commodityId,this.commodity[x].commodityDesc,this._allocation);
        cnt++;
          }
          this._commoditymodellist2[this._commoditymodellist2.length]=new Commodity( "",this.secondselectedsimtype + " Total",this._allocation);
          let allocatetypeindex=this._commodityallocation.findIndex(i=>i.allocationType==this.secondselectedsimtype);
          this._commodityallocation[allocatetypeindex]=new CommodityAllocation(this.secondselectedsimtype,this._commoditymodellist2);
       
        }
          else{
        let selectedsimtype2= this.simType.split(",",2)[1];        
       
         for(let x in this.commodity)
         {       
           for(let y in this._buallocation)
           {
             this._allocation[y]=new Allocation(0,0);
           }
           this._commoditymodellist2[x]=new Commodity( this.commodity[x].commodityId,this.commodity[x].commodityDesc,this._allocation);
        
          }
         this._commoditymodellist2[this._commoditymodellist2.length]=new Commodity( "",selectedsimtype2 + " Total",this._allocation);
          this._commodityallocation[this._commodityallocation.length]=new CommodityAllocation(selectedsimtype2,this._commoditymodellist2);
     }
        }
        else if(this.firstselectedsimtype && this.firstselectedsimtype==this.simType.split(",",2)[1] )
        {
          let cnt:number=0;
          for(let x in this.commodity)
          {       
            for(let y in this._buallocation)
            {
               this._allocation[y]=(new Allocation(0,0));              
            }
           
            this._commoditymodellist[((this._commoditymodellist.length-1)*1)+(cnt*1)]=new Commodity( this.commodity[x].commodityId,this.commodity[x].commodityDesc,this._allocation);
           cnt++;
          }
          this._commoditymodellist[this._commoditymodellist.length]=new Commodity( "",this.firstselectedsimtype + " Total",this._allocation);
          let allocatetypeindex=this._commodityallocation.findIndex(i=>i.allocationType==this.firstselectedsimtype);
          this._commodityallocation[allocatetypeindex]=new CommodityAllocation(this.firstselectedsimtype,this._commoditymodellist);
       
        }
        else if(this.secondselectedsimtype && this.secondselectedsimtype==this.simType.split(",",2)[1] )
        {
          for(let x in this.commodity)
          {       
            for(let y in this._buallocation)
            {
              
              this._allocation[y]=(new Allocation(0,0));
            }
            
            this._commoditymodellist2[this._commoditymodellist2.length-1]=new Commodity( this.commodity[x].commodityId,this.commodity[x].commodityDesc,this._allocation);
          }
          this._commoditymodellist2[this._commoditymodellist2.length]=new Commodity( "",this.secondselectedsimtype + " Total",this._allocation);
          let allocatetypeindex=this._commodityallocation.findIndex(i=>i.allocationType==this.firstselectedsimtype);
          this._commodityallocation[allocatetypeindex]=new CommodityAllocation(this.secondselectedsimtype,this._commoditymodellist2);
        
        }
      else{
       this.selectedsimtype= this.simType.split(",",2)[1];
      
     for(let x in this.commodity)
     {       
       for(let y in this._buallocation)
       {       
         this._allocation[y]=(new Allocation(0,0));
       }
       this._commoditymodellist[x]=new Commodity( this.commodity[x].commodityId,this.commodity[x].commodityDesc,this._allocation);
     }
     this._commoditymodellist[this._commoditymodellist.length]=new Commodity( "",this.selectedsimtype + " Total",this._allocation);
   
     this._commodityallocation[this._commodityallocation.length]=new CommodityAllocation(this.selectedsimtype,this._commoditymodellist);
        
     this._allocationDataModel.commodityAllocation=this._commodityallocation;
    }
  }

    /*  End Code for assigning data to allocationdatamodel */
   
     if(this.commodity.length>0 && this.simType.length>0)     {
      this.display=true;
      this.selectedsimtype= this.simType.split(",",2)[1];
      if(this.firstselectedsimtype==this.selectedsimtype)      {
        for(let x in this.commodity){
        //if (this.commodity.hasOwnProperty(x)){
          this.firstselectedcommoditylist.push(this.commodity[x]);         
        //}
     }
               
   }
    else if(this.secondselectedsimtype==this.selectedsimtype)    {
        for(let x in this.commodity){
          //if (this.commodity.hasOwnProperty(x)){
          this.secondselectedcommoditylist.push(this.commodity[x]);
          //}
      } 
    }
    else{
      this.trdisplaylist=this.trdisplaylist+1;  
      if(this.trdisplaylist==1){
       this.firstselectedcommoditylist=this.commodity;       
       this.firstselectedsimtype= this.simType.split(",",2)[1];     
      }
      else  if(this.trdisplaylist==2){
        this.secondselectedcommoditylist=this.commodity;
        this.secondselectedsimtype=this.simType.split(",",2)[1]; 
      }      
    }
  }   
     this.selectedsimtypelist=this.simType;
     this.simType="undefined";    
     this.getCommodities();
     this.isCancel = false;
  } 
  getBUProductItems() {
    this.allocateCommoditiesService.getBUProductItems().subscribe((data:any)=>{ 
      this.buprodctinfo=data;      
  }, error =>{
    
  }
    )
  }
  RowColCalculatePercentage(event,ecommodityid,allocatetype,columnindex):void
  {
    
    /* Row Calculation */
    let rowtotal:number=0;
    let cnt:number=1;
    let colindex=this._commodityallocation.findIndex(i=>i.allocationType==allocatetype);
    let cmdlist=this._commodityallocation[colindex].commoditieslist;
    let item1 = cmdlist.find(i => i.commodityGrpId=== ecommodityid);
    let index = cmdlist.findIndex(i => i.commodityGrpId=== ecommodityid);
    //this._commodityallocation[colindex].commoditieslist[index].allocationlist[columnindex].allocationpercentage=event.target.value;
    console.log("commodity allocation length"+item1.allocationlist.length+ " index "+ index + "  columnindex " +columnindex+  " colindex "+colindex);
   for(let i in cmdlist[index].allocationlist)
      {
        if(cnt<(cmdlist[index].allocationlist.length*1)) 
         {  rowtotal=(rowtotal*1)+(cmdlist[index].allocationlist[i].allocationpercentage*1);   
         console.log(" i "+ i +" cmdlist[index].allocationlist[i].allocationpercentage" + cmdlist[index].allocationlist[i].allocationpercentage+ " rowtotal "+rowtotal);
        }
      cnt++;
    }
    this._commodityallocation[colindex].commoditieslist[index].allocationlist[(item1.allocationlist.length)-1].allocationpercentage=rowtotal;    
     /* End of Row Calculation */

      /* Col Calculation */
      let cntrow:number=cmdlist.length-1;
      let coltotal:number=0;
      let cntcol:number=0;
      for(let x=0;x<cmdlist.length;x++)
       {
             if(cntrow==x)
              {
                //this._commodityallocation[colindex].commoditieslist[x].allocationlist[cntcol].allocationpercentage=coltotal;
                cntcol++;                                
              }      
              else
              {              
                coltotal=(coltotal*1)+(this._commodityallocation[colindex].commoditieslist[x].allocationlist[columnindex].allocationpercentage*1);
              }        
       
     }
     
     /* End of ColCalCulation */
  }
  RowColCalculateTarget(event,ecommodityid,allocatetype,columnindex):void
  {
    
    /* Row Calculation */
    let rowtotal:number=0;
    let cnt:number=1;
    let colindex=this._commodityallocation.findIndex(i=>i.allocationType==allocatetype);
   let cmdlist=this._commodityallocation[colindex].commoditieslist;
    let item1 = cmdlist.find(i => i.commodityGrpId=== ecommodityid);
    let index = cmdlist.findIndex(i => i.commodityGrpId=== ecommodityid);
    //this._commodityallocation[colindex].commoditieslist[index].allocationlist[columnindex].allocationtarget=event.target.value;
    for(let i in cmdlist[index].allocationlist)
      {
      
        if(cnt<cmdlist[index].allocationlist.length) 
         {  rowtotal=(rowtotal*1)+(cmdlist[index].allocationlist[i].allocationtarget*1);   
        }
      cnt++;
    }
    cmdlist[index].allocationlist[(item1.allocationlist.length)-1].allocationtarget=rowtotal;    
   
      /* End of Row Calculation */

      /* Col Calculation */
   
      let cntcol:number=0;
      let cntrow:number=cmdlist.length-1;
      let coltotal:number=0;
      for(let c=0;c<cmdlist[0].allocationlist.length;c++){
      for(let x=0;x<cmdlist.length;x++)
       {        
          
             if(cntrow==x)
              {
                //this._commodityallocation[colindex].commoditieslist[x].allocationlist[cntcol].allocationtarget=coltotal;
                cntcol++;
              }      
              else
              {
                coltotal=(coltotal*1)+(this._commodityallocation[colindex].commoditieslist[x].allocationlist[c].allocationtarget*1);
              }        
        }
     }
     
     /* End of ColCalCulation */
  }

  cancel() {
    this.isCancelModalOpened = true;
  }

  cancelAllocationChange(isAllocationChanged: boolean) {
    if (isAllocationChanged) {
      this.allocateCommoditiesService.getCommodityAllocation().subscribe(
        (res: any) => {
          this.commodityAllocationList = res;
          if (this.commodityAllocationList.default.length > 0 ) {
            // on cancel - yes and saved data is available
            this.commodityAllocationList.editable = isAllocationChanged;
            this.commodityAllocationList.commodityViewMode = isAllocationChanged;
            this.editEvent.emit(this.commodityAllocationList);
            console.log(this.commodityAllocationList);
          } else {
            // on cancel - yes and saved data is not available
            this.commodityAllocationList.editable = !isAllocationChanged;
            this.commodityAllocationList.commodityViewMode = !isAllocationChanged;
            console.log(isAllocationChanged);
          }
        },
        error => {
          console.log("Error in getCommodityAllocation----"+ error);
        }
      )
      
    }
    this.isCancelModalOpened = false;
  }

  save(editable: boolean, commodityViewMode: boolean) {
    this.allocateCommoditiesService.saveCommodityAllocation().subscribe(
      (res: any) => {
        this.commodityAllocationList = res;
        this.commodityAllocationList['editable'] = !editable;
        this.commodityAllocationList['commodityViewMode'] = commodityViewMode;
        this.editEvent.emit(this.commodityAllocationList);
        console.log(this.commodityAllocationList);
      },
      error=> {
        console.log("Error in saveCommodityAllocation----"+ error);
      });
  }





}
