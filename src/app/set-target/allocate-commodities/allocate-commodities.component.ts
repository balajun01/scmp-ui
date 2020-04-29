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
import { JsonPipe } from '@angular/common';


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
  //@Input() allocationData: any=[];  
  allocationData:any;
  @Output() editEvent = new EventEmitter<any>();
  @Input() commodityAllocationList: any;
  selectedcommoditylist:any=[];
  trdisplaylist:number=0;
  disabled:boolean=false;  
  commodityrowtotal:number=0; 
  commoditycoltotal:number=0;
  commodityrowcoltotallist:any=[];
   displayallocate:boolean=true;
   _allocationDataModel:AllocationdataModel;
    _buallocation:BUAllocation[]=[];
    _commodityallocation:CommodityAllocation[]=[];  
    _allocation:Allocation[]=[];  
   numberarray:number[]=[];
  isCancel = true;
  isCancelModalOpened = false;
  cancelModalMessage = 'Are you sure you want to cancel it ?';
  selectedsimulatelist:any=[];
  deleteindex:number=0;
  deleteitem1:any;
  isedit:boolean=true;
  isSave:boolean=true;
  targetId:string;
  @Input() quarterId: number;
  @Input() targetIdQuarter:any;
  @Output() valueChange = new EventEmitter<any>();
  constructor(private formBuilder: FormBuilder, private allocateCommoditiesService: AllocateCommoditiesService) { }

  ngOnInit() {
    
    
    
      //////console.log("  test model: "+ JSON.stringify(this._allocationDataModel));
     console.log(" from frame2"+ JSON.stringify( this.allocationData)+ "Quaterid from frame1"+ this.quarterId+" targetIdQuarter from frame1 "+this.targetIdQuarter);
     //if(this.targetId!==this.targetIdQuarter){
      this.allocateCommoditiesService.getSavedProductGroupAllocation(this.targetIdQuarter).subscribe(
        (res: any) => {
          this.allocationData=res;
          //this._allocationDataModel=res;
          //this.commodityAllocationList = res;   
          console.log(" tab switch "+ JSON.stringify(this.allocationData));   
          console.log(" beofre alocation data exist "+JSON.stringify(this.allocationData) );
          if(this.allocationData && this.allocationData.length>0){
            console.log(" after alocation data exist "+JSON.stringify(this.allocationData) );
           let totalamountallocated:number=0;
           this.targetId=this.allocationData[0].targetId;
           for(let i in this.allocationData){     
           this._buallocation[i]=new BUAllocation(this.allocationData[i].prodBuId,this.allocationData[i].prodBuDesc,this.allocationData[i].prodGrpId,this.allocationData[i].prodGrpDesc,this.allocationData[i].amountAllocated,this.targetId);
         
           if(!Number.isNaN(this.allocationData[i].amountAllocated*1)){
           totalamountallocated=(totalamountallocated*1)+(this.allocationData[i].amountAllocated*1);   
           ////console.log("totalamountallocated"+totalamountallocated);
          }   
         }
         
         this._buallocation[this._buallocation.length]=new BUAllocation(0, "TOTAL",0,"",parseFloat(totalamountallocated.toFixed(4)),this.allocationData[0].targetId);
         //this._allocationDataModel.commodityAllocation.push(new CommodityAllocation('SIMULATE',[]));
         //this._allocationDataModel.commodityAllocation.push(new CommodityAllocation('NON SIMULATE',[]));
         this._allocationDataModel=new AllocationdataModel(this._buallocation,this._commodityallocation);
          console.log("  test model: "+ JSON.stringify(this._allocationDataModel));
          this.getSelectType();
          this.getCommodities();
          this.getAllocateBy();
         } 
        },
        error => {
          console.log("Error in Commodity ALlocation Edit API----"+ error);
        }
      )
    //}
   
    this.commoditySettings = {
      singleSelection: false,
       idField: 'commodityId',
       textField: 'commodityDesc',       
      enableCheckAll: false,
      itemsShowLimit: 2,
      allowSearchFilter: true,
      searchPlaceholderText:"Search keyword...",    

    }
//////console.log(" commodity settings: "+this.commoditySettings);

/* start to bind edit data to html */
//console.log(" from edit "+ JSON.stringify(this.commodityAllocationList));
if(this.commodityAllocationList){
  
  this._allocationDataModel=this.commodityAllocationList;
  //console.log("inside edit"+ JSON.stringify(this._allocationDataModel)+ " edit object length"+this.commodityAllocationList.length);
}

/* end to bind edit data to html */
    
  }
  getAllocateBy() {
    this.allocateCommoditiesService.getAllocateBy().subscribe((data:any)=>{ 

      for(let i=0;i<this._allocationDataModel.buAllocation.length;i++)
      {
        if(this._allocationDataModel.buAllocation[i].amountAllocated==0)
        {
          console.log("bua"+this._allocationDataModel.buAllocation[i].amountAllocated)
          let allindex=data.findIndex(x=>x.method=="%")
          console.log( " index " + allindex+"list"+ JSON.stringify(data));
          data.splice(allindex,1);
          console.log("Allocate by list ", data);
          this.displayallocate=false;
        }
      }
      this.allocateByList=data;


  console.log("Allocate by list ", this.allocateByList);
  }, error =>{
    //////console.log(" error : ", error);
  }
    )
   
  }
  getCommodities() {
    this.allocateCommoditiesService.getCommodities().subscribe((data:any)=>{ 
      this.commodityList=data;      
   console.log(" to check cancel "+JSON.stringify(this._allocationDataModel));
   
         for(let i=0;i<this._allocationDataModel.commodityAllocation.length;i++)     {  
           
        for(let x in this._allocationDataModel.commodityAllocation[i].commoditiesList){
          ////console.log(" cmdallocation posotion"+ JSON.stringify(this._allocationDataModel.commodityAllocation[i].commoditiesList));  
          for(let y in this.commodityList){
            //console.log(" grpdesc "+JSON.stringify( this._allocationDataModel.commodityAllocation[i].commoditiesList[x].commodityGrpDesc));
            if(this._allocationDataModel.commodityAllocation[i].commoditiesList[x].commodityGrpDesc==this.commodityList[y].commodityDesc){
              this.commodityList[y].isDisabled=true;
              this.commodityList[y].checked=true; 
            }
          }     
        }
      }
        this.commodity=[];
      // }
       
  }, error =>{
    //////console.log(" error : ", error);
  }
    )
  }
  getSelectType() {

    this.allocateCommoditiesService.getSelectType().subscribe((data:any)=>{ 
      this.simTypeList=data;
    //////console.log("sim type list ", this.simTypeList);
  }, error =>{
    //////console.log(" error : ", error);
  }
    )
  }
  
  onallocateBySelect(item){    
    //////console.log(" selcted value is ",this.allocateType);
    if(item.target.value=="$M"){
      this.displayallocate=false;
    }
    else
    this.displayallocate=true;
  }  

  onCommoditySelect(item) {
   
    //////console.log("selected item:"+JSON.stringify(item));    
    // this.commodity.push(item);
    //////console.log(this.commodity);    
  }

  deletecommodity(event,ecommodityid,allocatetype1){
   
  // this._commoditymodellist
  //console.log("allocate type" + allocatetype1);
 
  //console.log("deletecommodity clicked"+event.target.value+ecommodityid+allocatetype1+JSON.stringify(this.deleteitem1)+this.deleteindex);
  //console.log(" before splice Allocation Model"+ JSON.stringify(this._allocationDataModel));
  let allocationindex=this._allocationDataModel.commodityAllocation.findIndex(i=>i.allocationType==allocatetype1);
  this.deleteindex = this._allocationDataModel.commodityAllocation[allocationindex].commoditiesList.findIndex(i => i.commodityGrpId=== ecommodityid);
  this.deleteitem1 = this._allocationDataModel.commodityAllocation[allocationindex].commoditiesList.find(i => i.commodityGrpId=== ecommodityid);
  this._allocationDataModel.commodityAllocation[allocationindex].commoditiesList.splice(this.deleteindex,1);
  //console.log(" after splice Allocation Model"+ JSON.stringify(this._allocationDataModel));
  let deletecommodiitieslist=this._allocationDataModel.commodityAllocation[allocationindex].commoditiesList;
  //to delete allocation+commidities if there is no rows
  if(!deletecommodiitieslist)
  {

  }
  for(let i=0; i< this._allocationDataModel.buAllocation.length;i++){
  this.RowColCalculateTarget(event,ecommodityid,allocatetype1,i);
  }
  this.getCommodities();
  }

  addCommodityRows(){
     this.valueChange.emit(true);
   //  console.log("add commdity "+ JSON.stringify(this.valueChange) );
    let rowtotal= {"allocation":0,"target":0}
        /*  Start Code for assigning data to allocationdatamodel */   
        let commoditiesArray = this.simType.split(',');     
        //this.simTypeList.push(commoditiesArray);
     if(this.selectedsimulatelist.length>0)
      {
       let index=this.selectedsimulatelist.findIndex(x=>x==commoditiesArray[1]);
       if(index<0)
       {
        this.selectedsimulatelist.push(commoditiesArray[1])
        this._allocationDataModel.commodityAllocation.push(new CommodityAllocation(commoditiesArray[1],[]));    
        }
        ////console.log(" simulate index "+index + JSON.stringify(this.selectedsimulatelist))
       }
      else{       
      this.selectedsimulatelist.push(commoditiesArray[1])
      this._allocationDataModel.commodityAllocation.push(new CommodityAllocation(commoditiesArray[1],[]));    
      }
      //console.log(" commodityallocation "+ JSON.stringify(this._allocationDataModel.commodityAllocation))
        ////console.log('comoditi list', this.commodity);
        
        let simulatetotal:number=0;
        this.commodity.forEach(x => {
          let alctnList:Allocation[]=[];
          let buallocationlength:number=0;
          for(let y in this._buallocation)  
          {
            if(buallocationlength<this._buallocation.length)
            alctnList.push(new Allocation(0,0));
            buallocationlength++
          }          
          let cmdty = new Commodity(x.commodityId, x.commodityDesc, alctnList);
          this._allocationDataModel.commodityAllocation.forEach(x=>{
            if(x.allocationType==commoditiesArray[1]){
            x.commoditiesList.push(cmdty);    
            }        
          });                
        });
       /* Start Code to add NON SIMULATE/SIMULATE TOTAL' */
       let buallocationlength: number = 0;
       let alctnList: Allocation[] = [];
       for (let y in this._buallocation) {
         if (buallocationlength < this._buallocation.length)
           alctnList.push(new Allocation(0, 0));
         buallocationlength++
       }
   
       let commodityAllocationFiltered = this._allocationDataModel.commodityAllocation.find(x => x.allocationType == commoditiesArray[1]);
       let indxNS = commodityAllocationFiltered.commoditiesList.findIndex(x => x.commodityGrpDesc == commoditiesArray[1]+" TOTAL");
       if (indxNS !== -1) {
         commodityAllocationFiltered.commoditiesList.push(commodityAllocationFiltered.commoditiesList.splice(indxNS, 1)[0]);
       } else {
         commodityAllocationFiltered.commoditiesList.push(new Commodity("", commoditiesArray[1] + " TOTAL", alctnList));
       }

      /* Total */
       buallocationlength= 0;
       let alctotalList: Allocation[] = [];
       for (let y in this._buallocation) {
         if (buallocationlength < this._buallocation.length)
         alctotalList.push(new Allocation(0, 0));
         buallocationlength++
       }

    /* GAP TO TARGET */
     buallocationlength = 0;
    let alcGTTList: Allocation[] = [];
    for (let y in this._buallocation) {
      if (buallocationlength < this._buallocation.length)
      alcGTTList.push(new Allocation(100, this._allocationDataModel.buAllocation[y].amountAllocated));
      buallocationlength++
    }
    let tl:any;
    let gtt:any;
    if(this._allocationDataModel.commodityAllocation.length>1){
     tl=this._allocationDataModel.commodityAllocation[this._allocationDataModel.commodityAllocation.length-1].commoditiesList.find(x=>x.commodityGrpDesc==="TOTAL");
     gtt=this._allocationDataModel.commodityAllocation[this._allocationDataModel.commodityAllocation.length-1].commoditiesList.find(x=>x.commodityGrpDesc==="GAP TO TARGET");
     //console.log("tl"+ JSON.stringify( tl)+ "gtt"+JSON.stringify(gtt)+"allocation length"+this._allocationDataModel.commodityAllocation.length);
       this._allocationDataModel.commodityAllocation.forEach(x=>{
         x.commoditiesList = x.commoditiesList.filter(x => x.commodityGrpDesc !== "TOTAL");
         x.commoditiesList = x.commoditiesList.filter(x => x.commodityGrpDesc !== "GAP TO TARGET");
       })
      }
     
       let commodityAllocationFilteredTotal = 
         this._allocationDataModel.commodityAllocation[this._allocationDataModel.commodityAllocation.length-1];
         //console.log(" Filetered Total "+JSON.stringify(commodityAllocationFilteredTotal));
       if (commodityAllocationFilteredTotal) {
         let indxtot = commodityAllocationFilteredTotal.commoditiesList.findIndex(x => x.commodityGrpDesc == "TOTAL");
         if (indxtot !== -1) {
           commodityAllocationFilteredTotal.commoditiesList.push(commodityAllocationFilteredTotal.commoditiesList.splice(indxtot, 1)[0]);
         } else {
           if(tl!=undefined){
            this._allocationDataModel.commodityAllocation[this._allocationDataModel.commodityAllocation.length - 1].commoditiesList.push(tl);
             }
           else{
          this._allocationDataModel.commodityAllocation[this._allocationDataModel.commodityAllocation.length - 1].commoditiesList.push(new Commodity("", "TOTAL", alctotalList));
           }
         }
   
         let indxgap = commodityAllocationFilteredTotal.commoditiesList.findIndex(x => x.commodityGrpDesc == "GAP TO TARGET");
         if (indxgap !== -1) {
           commodityAllocationFilteredTotal.commoditiesList.push(commodityAllocationFilteredTotal.commoditiesList.splice(indxgap, 1)[0]);
         } else {
           if(gtt!=undefined){
            this._allocationDataModel.commodityAllocation[this._allocationDataModel.commodityAllocation.length - 1].commoditiesList.push(gtt);
  
           }
           else{
          this._allocationDataModel.commodityAllocation[this._allocationDataModel.commodityAllocation.length - 1].commoditiesList.push(new Commodity("", "GAP TO TARGET", alcGTTList));
         }
        }
       }
       
    /* End Code to add NON SIMULATE/SIMULATE TOTAL */

   
     this.selectedsimtypelist=this.simType;
     this.simType="undefined";      
      this.getCommodities();  

      /* Cancel Code */
      this.isCancel=false;
      this.isSave=false;
      
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
    let cnt:number=1;
    let cnt1:number=1;
    let colindex=this._allocationDataModel.commodityAllocation.findIndex(i=>i.allocationType==allocatetype);
    let cmdlist=this._allocationDataModel.commodityAllocation[colindex].commoditiesList;
    let coltotalindex=cmdlist.findIndex(i=>i.commodityGrpDesc==allocatetype+' TOTAL');
    let item1 = cmdlist.find(i => i.commodityGrpId=== ecommodityid);
    let index = cmdlist.findIndex(i => i.commodityGrpId=== ecommodityid);  
    if(index==-1){
      index=this.deleteindex;
    }
    if(!item1){
      item1=this.deleteitem1;
    }


//console.log("deleteindex"+this.deleteindex+"deleteitem"+JSON.stringify( this.deleteitem1));

      /* Col Calculation */
      
      let cntrow:number=cmdlist.length-1;
      if(coltotalindex!==-1){
        cntrow=coltotalindex;
      }
      let coltotal:number=0;
      let cntcol:number=0;
      for(let x=0;x<cmdlist.length;x++)
       {
         //console.log(" after delete count "+cmdlist.length+ "index simulate total"+coltotalindex);

             if(cntrow==x)
              {
               this._allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[columnindex].allocationPercentage=parseFloat(coltotal.toFixed(4));
                cntcol++;                                
              }      
              else
              {              
                coltotal=(coltotal*1)+(this._allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[columnindex].allocationPercentage*1);
              }        
      ////console.log("colindex"+ colindex +"coltotal"+coltotal+"columnindex"+columnindex+ "Percentage"+ this._allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[columnindex].allocationPercentage); 
     }
     
     /* End of ColCalCulation */    

     
     /* Row Calculation */
     let rowtotal:number=0;
     for(let i in cmdlist[index].allocationList)
     {
       if(cnt<(cmdlist[index].allocationList.length*1)) 
        { 
          ////console.log("targetcalclations"+ JSON.stringify(cmdlist[index]) );
           //rowtotal=(rowtotal*1)+(cmdlist[index].allocationList[i].allocationPercentage*1); 
           if(!Number.isNaN(this._allocationDataModel.buAllocation[i].amountAllocated*1) && (this._allocationDataModel.buAllocation[i].amountAllocated*1)!==0){  
           let target=(this._allocationDataModel.buAllocation[i].amountAllocated*1)*((cmdlist[index].allocationList[i].allocationPercentage*1)/(100*1));
           this._allocationDataModel.commodityAllocation[colindex].commoditiesList[index].allocationList[i].allocationTarget=parseFloat(target.toFixed(4));
           ////console.log("target"+target);
          }
        }
          
     cnt++;
   }
   rowtotal=(this._allocationDataModel.buAllocation[(item1.allocationList.length)-1].amountAllocated*1)*((cmdlist[index].allocationList[(item1.allocationList.length)-1].allocationPercentage*1)/(100*1));
   this._allocationDataModel.commodityAllocation[colindex].commoditiesList[index].allocationList[(item1.allocationList.length)-1].allocationPercentage=Number.isNaN(rowtotal)?0:parseFloat(rowtotal.toFixed(4));    
  
   /* End of Row Calculation */

   /* Start of Total and GAP TO TARGET Calculation*/
   let simulatetotalindex1= this._allocationDataModel.commodityAllocation.findIndex(i=>i.allocationType=="SIMULATE");
   let simulatetotalindex2= this._allocationDataModel.commodityAllocation.findIndex(i=>i.allocationType=="NON SIMULATE");
  //console.log("simulatetotalindex1"+simulatetotalindex1+simulatetotalindex2);
   if(simulatetotalindex1!==-1 && simulatetotalindex2==-1){
     let clist=this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL");
     let clisttotal=   this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt=this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
     for(let t=0;t<clist.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage=parseFloat(( this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL").allocationList[t].allocationPercentage).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationPercentage=parseFloat(((100*1)-( this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
     }
   //console.log("clist"+clist+"clisttotal"+JSON.stringify( clisttotal)+"clistgtt"+JSON.stringify( clistgtt));
   }
   else if(simulatetotalindex1==-1 && simulatetotalindex2!==-1){
     let clist=this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="NON SIMULATE TOTAL");
     let clisttotal=   this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt=this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
     for(let t=0;t<clist.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage=parseFloat((this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="NON SIMULATE TOTAL").allocationList[t].allocationPercentage).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationPercentage=parseFloat(((100*1)-( this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
      }
   }
   else if(simulatetotalindex1!==-1 && simulatetotalindex2!==-1){

     let clisttotal=   this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt=this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
     let clisttotal1=   this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt1=this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
  
     if(clisttotal && clistgtt){
       //console.log(" clisttotal "+ clisttotal+" clistgtt "+ clistgtt);
     for(let t=0;t<clisttotal.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage=parseFloat(((this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="NON SIMULATE TOTAL").allocationList[t].allocationPercentage*1)+(this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationPercentage=parseFloat(((100*1)-(this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
  
     }      
   }
   if(clisttotal1 && clistgtt1){
     //console.log(" clisttotal1 "+ clisttotal1+" clistgtt1 "+ clistgtt1);
     for(let t=0;t<clisttotal1.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage=parseFloat(((this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="NON SIMULATE TOTAL").allocationList[t].allocationPercentage*1)+(this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationPercentage=parseFloat(((100*1)-(this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
     }
   }
   }
  /* End of Total and GAP TO TARGET Calculation*/
  this.RowColCalculateTarget(event,ecommodityid,allocatetype,columnindex);
  
  }
  RowColCalculateTarget(event,ecommodityid,allocatetype,columnindex):void
  {    
    let cnt:number=1;
    let cnt1:number=1;
    let colindex=this._allocationDataModel.commodityAllocation.findIndex(i=>i.allocationType==allocatetype);
    let cmdlist=this._allocationDataModel.commodityAllocation[colindex].commoditiesList;
    let coltotalindex=cmdlist.findIndex(i=>i.commodityGrpDesc==allocatetype+' TOTAL');
    let item1 = cmdlist.find(i => i.commodityGrpId=== ecommodityid);
    let index = cmdlist.findIndex(i => i.commodityGrpId=== ecommodityid);  
    if(index==-1){
      index=this.deleteindex;
    }
    if(!item1){
      item1=this.deleteitem1;
    }
    /* Col Calculation */      
      let cntrow:number=cmdlist.length-1;
      if(coltotalindex!==-1){
        cntrow=coltotalindex;
      }
      let coltotal:number=0;
      let cntcol:number=0;
      for(let x=0;x<cmdlist.length;x++)
       {
             if(cntrow==x)
              {
                //console.log("target column calculations "+ coltotal + " row number after deletion total "+x );
               this._allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[columnindex].allocationTarget=parseFloat(coltotal.toFixed(4));
                cntcol++;                                
              }      
              else
              {    
                //console.log("target column calculations "+ coltotal+ " row number after deletion "+x + "colindex"+colindex+"columnindex"+columnindex+  " each col value "+ JSON.stringify(this._allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[columnindex].allocationTarget));       
                coltotal=(coltotal*1)+(this._allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[columnindex].allocationTarget*1);
              }        
       }
     
     /* End of ColCalCulation */    
     
     /* Row Calculation */
     let rowtotal:number=0;
     for(let i in cmdlist[index].allocationList)
     {
       if(cnt<(cmdlist[index].allocationList.length*1)) 
        { 
           rowtotal=(rowtotal*1)+(cmdlist[index].allocationList[i].allocationTarget*1);   
           if(!Number.isNaN((this._allocationDataModel.buAllocation[i].amountAllocated*1))&& (this._allocationDataModel.buAllocation[i].amountAllocated*1)!==0){
           let percentage=((cmdlist[index].allocationList[i].allocationTarget*1)*(100*1))/(this._allocationDataModel.buAllocation[i].amountAllocated*1);
           this._allocationDataModel.commodityAllocation[colindex].commoditiesList[index].allocationList[i].allocationPercentage=parseFloat(percentage.toFixed(4));
           ////console.log("percentage"+((cmdlist[index].allocationList[i].allocationTarget*1)*(100*1))+"bu"+(this._allocationDataModel.buAllocation[i].amountAllocated*1));
        }
      }
     cnt++;
   }
   this._allocationDataModel.commodityAllocation[colindex].commoditiesList[index].allocationList[(item1.allocationList.length)-1].allocationTarget=parseFloat(rowtotal.toFixed(4));    
    if(coltotalindex!==-1){
      let rowttotal:number=0;
      for(let i in cmdlist[coltotalindex].allocationList)
      {
        if(cnt1<(cmdlist[coltotalindex].allocationList.length*1)) 
         { 
            rowttotal=(rowttotal*1)+(cmdlist[coltotalindex].allocationList[i].allocationTarget*1);   
            if(!Number.isNaN((this._allocationDataModel.buAllocation[columnindex].amountAllocated*1))&& (this._allocationDataModel.buAllocation[columnindex].amountAllocated*1)!==0){
              let percentage=((cmdlist[coltotalindex].allocationList[columnindex].allocationTarget*1)*(100*1))/(this._allocationDataModel.buAllocation[columnindex].amountAllocated*1);
              this._allocationDataModel.commodityAllocation[colindex].commoditiesList[coltotalindex].allocationList[columnindex].allocationPercentage= parseFloat(percentage.toFixed(4));
             //console.log(" somulate total percentageng"+ percentage+  " model percentage"+JSON.stringify( this._allocationDataModel.commodityAllocation[colindex].commoditiesList[coltotalindex].allocationList[columnindex].allocationPercentage));
         }
      cnt1++;
    }
    this._allocationDataModel.commodityAllocation[colindex].commoditiesList[coltotalindex].allocationList[(item1.allocationList.length)-1].allocationTarget=parseFloat(rowttotal.toFixed(4));    
    }
  }
   /* End of Row Calculation */

   /* Start of Total and GAP TO TARGET Calculation*/
   let simulatetotalindex1= this._allocationDataModel.commodityAllocation.findIndex(i=>i.allocationType=="SIMULATE");
   let simulatetotalindex2= this._allocationDataModel.commodityAllocation.findIndex(i=>i.allocationType=="NON SIMULATE");
 
   if(simulatetotalindex1!==-1 && simulatetotalindex2==-1){
     let clist=this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL");
     let clisttotal=   this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt=this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
     for(let t=0;t<clist.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationTarget=parseFloat((this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL").allocationList[t].allocationTarget).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationTarget=parseFloat(((this._allocationDataModel.buAllocation[t].amountAllocated*1)-( this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationTarget*1)).toFixed(4));
  
     }   
   }
   else if(simulatetotalindex1==-1 && simulatetotalindex2!==-1){
     let clist=this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=='NON SIMULATE TOTAL');
     let clisttotal=   this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt=this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
     for(let t=0;t<clist.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationTarget=parseFloat((this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="NON SIMULATE TOTAL").allocationList[t].allocationTarget).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationTarget=parseFloat(((this._allocationDataModel.buAllocation[t].amountAllocated*1)-( this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationTarget*1)).toFixed(4));
  
     }
     
   }
   else if(simulatetotalindex1!==-1 && simulatetotalindex2!==-1){

     let clisttotal=   this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt=this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
     let clisttotal1=   this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt1=this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
  
     if(clisttotal && clistgtt){
       //console.log(" clisttotal "+ clisttotal+" clistgtt "+ clistgtt);
     for(let t=0;t<clisttotal.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationTarget= parseFloat(((this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="NON SIMULATE TOTAL").allocationList[t].allocationTarget*1)+(this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL").allocationList[t].allocationTarget*1)).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationTarget=parseFloat(((this._allocationDataModel.buAllocation[t].amountAllocated*1)-(this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationTarget*1)).toFixed(4));
  
     }      
   }
   if(clisttotal1 && clistgtt1){
     //console.log(" clisttotal1 "+ clisttotal1+" clistgtt1 "+ clistgtt1);
     for(let t=0;t<clisttotal1.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationTarget=parseFloat(((this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="NON SIMULATE TOTAL").allocationList[t].allocationTarget*1)+(this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL").allocationList[t].allocationTarget*1)).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationTarget=parseFloat(((this._allocationDataModel.buAllocation[t].amountAllocated*1)-(this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationTarget*1)).toFixed(4));
     }
   }
   }
  /* End of Total and GAP TO TARGET Calculation*/
 this.RowReColCalculatePercentage(event,ecommodityid,allocatetype,columnindex);
 this.isCancel = false;
  }
  RowReColCalculatePercentage(event,ecommodityid,allocatetype,columnindex):void
  {     
    let cnt:number=1;
    let cnt1:number=1;
    let colindex=this._allocationDataModel.commodityAllocation.findIndex(i=>i.allocationType==allocatetype);
    let cmdlist=this._allocationDataModel.commodityAllocation[colindex].commoditiesList;
    let coltotalindex=cmdlist.findIndex(i=>i.commodityGrpDesc==allocatetype+' TOTAL');
    let item1 = cmdlist.find(i => i.commodityGrpId=== ecommodityid);
    let index = cmdlist.findIndex(i => i.commodityGrpId=== ecommodityid);  
    if(index==-1){
      index=this.deleteindex;
    }
    if(!item1){
      item1=this.deleteitem1;
    }
      /* Col Calculation */
      
      let cntrow:number=cmdlist.length-1;
      if(coltotalindex!==-1){
        cntrow=coltotalindex;
      }
      let coltotal:number=0;
      let cntcol:number=0;
      for(let x=0;x<cmdlist.length;x++)
       {
             if(cntrow==x)
              {
               this._allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[columnindex].allocationPercentage=parseFloat(coltotal.toFixed(4));
                cntcol++;                                
              }      
              else
              {              
                coltotal=(coltotal*1)+(this._allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[columnindex].allocationPercentage*1);
              }     
        }
     
     /* End of ColCalCulation */    

     
     /* Row Calculation */
     let rowtotal:number=0;
 
  for(let x=0;x<cmdlist.length;x++)
  {
    
    ////console.log("test"+ JSON.stringify(this._allocationDataModel.commodityAllocation[colindex].commoditiesList[x]));
    if(!Number.isNaN((this._allocationDataModel.buAllocation[(item1.allocationList.length)-1].amountAllocated*1))&& (this._allocationDataModel.buAllocation[(item1.allocationList.length)-1].amountAllocated*1)!==0){
               let percentage=(( this. _allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[(item1.allocationList.length)-1].allocationTarget*1)*(100*1))/(this._allocationDataModel.buAllocation[(item1.allocationList.length)-1].amountAllocated*1);
               this. _allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[(item1.allocationList.length)-1].allocationPercentage= parseFloat(percentage.toFixed(4));
               ////console.log("test"+this. _allocationDataModel.commodityAllocation[colindex].commoditiesList[x].allocationList[(item1.allocationList.length)-1].allocationTarget*1+"colindex"+colindex+"x"+x)
             }   
  }
   
   if(coltotalindex!==-1){
      //console.log( "  after delete cmdlist  "+ JSON.stringify(cmdlist));
      if(!Number.isNaN((this._allocationDataModel.buAllocation[(item1.allocationList.length)-1].amountAllocated*1))&& (this._allocationDataModel.buAllocation[(item1.allocationList.length)-1].amountAllocated*1)!==0){
         
        let percentage=((this. _allocationDataModel.commodityAllocation[colindex].commoditiesList[coltotalindex].allocationList[(item1.allocationList.length)-1].allocationTarget*1)*(100*1))/(this._allocationDataModel.buAllocation[(item1.allocationList.length)-1].amountAllocated*1);
          this. _allocationDataModel.commodityAllocation[colindex].commoditiesList[coltotalindex].allocationList[(item1.allocationList.length)-1].allocationPercentage= parseFloat(percentage.toFixed(4));
           //console.log(" test simulate total"+ this._allocationDataModel.commodityAllocation[colindex].commoditiesList[coltotalindex].allocationList[(item1.allocationList.length)-1].allocationPercentage+ "  allocation length"+((item1.allocationList.length*1)-1));
            }
          }
   /* End of Row Calculation */

   /* Start of Total and GAP TO TARGET Calculation*/
   let simulatetotalindex1= this._allocationDataModel.commodityAllocation.findIndex(i=>i.allocationType=="SIMULATE");
   let simulatetotalindex2= this._allocationDataModel.commodityAllocation.findIndex(i=>i.allocationType=="NON SIMULATE");
  //console.log("simulatetotalindex1"+simulatetotalindex1+simulatetotalindex2);
   if(simulatetotalindex1!==-1 && simulatetotalindex2==-1){
     let clist=this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL");
     let clisttotal=   this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt=this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
     for(let t=0;t<clist.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage=parseFloat((this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL").allocationList[t].allocationPercentage).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationPercentage=parseFloat(((100*1)-( this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
  
     }
   //console.log("clist"+clist+"clisttotal"+JSON.stringify( clisttotal)+"clistgtt"+JSON.stringify( clistgtt));
   }
   else if(simulatetotalindex1==-1 && simulatetotalindex2!==-1){
     let clist=this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=='NON SIMULATE TOTAL');
     let clisttotal=   this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt=this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
     for(let t=0;t<clist.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage=parseFloat((this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="NON SIMULATE TOTAL").allocationList[t].allocationPercentage).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationPercentage=parseFloat(((100*1)-( this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
      }     
   }
   else if(simulatetotalindex1!==-1 && simulatetotalindex2!==-1){

     let clisttotal=   this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt=this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
     let clisttotal1=   this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL");
     let clistgtt1=this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=='GAP TO TARGET');
  
     if(clisttotal && clistgtt){
       //console.log(" clisttotal "+ clisttotal+" clistgtt "+ clistgtt);
     for(let t=0;t<clisttotal.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage= parseFloat(((this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="NON SIMULATE TOTAL").allocationList[t].allocationPercentage*1)+(this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
       this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationPercentage=parseFloat(((100*1)-(this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
  
     }      
   }
   if(clisttotal1 && clistgtt1){
     //console.log(" clisttotal1 "+ clisttotal1+" clistgtt1 "+ clistgtt1);
     for(let t=0;t<clisttotal1.allocationList.length;t++)
     {
       this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage=parseFloat(((this._allocationDataModel.commodityAllocation[simulatetotalindex2].commoditiesList.find(i=>i.commodityGrpDesc=="NON SIMULATE TOTAL").allocationList[t].allocationPercentage*1)+(this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="SIMULATE TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
        this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="GAP TO TARGET").allocationList[t].allocationPercentage=parseFloat(((100*1)-(this._allocationDataModel.commodityAllocation[simulatetotalindex1].commoditiesList.find(i=>i.commodityGrpDesc=="TOTAL").allocationList[t].allocationPercentage*1)).toFixed(4));
     }
   }
   }
  /* End of Total and GAP TO TARGET Calculation*/
  }
  cancel() {
    this.isCancelModalOpened = true;
  }
  cancelAllocationChange(isAllocationChanged: boolean) {
    if (isAllocationChanged) {
      console.log(" targetid "+JSON.stringify( this.targetId));
      this.allocateCommoditiesService.getCancelCommodityAllocation(this.targetId).subscribe(
        (res: any) => {
          this.commodityAllocationList = res;
          console.log("cancel res"+JSON.stringify( res)+"lenght"+ JSON.stringify( res.commodityAllocation.length));
          if(res.commodityAllocation.length<=0){
            this._allocationDataModel=res;
            this.commodityAllocationList.editable = !isAllocationChanged;
           this.commodityAllocationList.commodityViewMode = !isAllocationChanged;
          }else{
            this.commodityAllocationList.editable = isAllocationChanged;
            this.commodityAllocationList.commodityViewMode = isAllocationChanged;
            this.editEvent.emit(this.commodityAllocationList);
          // if (this.commodityAllocationList ) {
          //   // on cancel - yes and saved data is available
           
          //   //console.log(this.commodityAllocationList);
          // } else {
          //   // on cancel - yes and saved data is not available
          //   this.commodityAllocationList.editable = !isAllocationChanged;
          //   this.commodityAllocationList.commodityViewMode = !isAllocationChanged;
          //   //console.log(isAllocationChanged);
          // }
          }
          this.getCommodities();
          this.valueChange.emit(false);
        },
        error => {
          //console.log("Error in getCommodityAllocation----"+ error);
        }
      )
      
    }
    this.isCancelModalOpened = false;
    
  }
  save(editable: boolean, commodityViewMode: boolean) {
    console.log("editable "+editable+" commodityviewmode"+commodityViewMode)
    this.allocateCommoditiesService.saveCommodityAllocation(this._allocationDataModel).subscribe(
      (res: any) => {
        this.commodityAllocationList = res;
        this.commodityAllocationList['editable'] = !editable;
        this.commodityAllocationList['commodityViewMode'] = commodityViewMode;
        this.editEvent.emit(this.commodityAllocationList);
        //console.log(this.commodityAllocationList);
    
     this.valueChange.emit(false);
   
        
      },
      error=> {
        //console.log("Error in saveCommodityAllocation----"+ error);
      });     
  } 
 start(event){   
   if( event.target.value==0)
   event.target.value=event.target.value.replace("0","");
 }
 end(event){
   if(event.target.value=="")
      event.target.value=event.target.value.replace("","0");
 }
}
const format = (num, decimals) => num.toLocaleString('en-US', {
  minimumFractionDigits: 4,      
  maximumFractionDigits:4,
});