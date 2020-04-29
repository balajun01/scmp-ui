import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AllocateCommodityViewFrameService } from '../allocate-commodity-view-frame/allocate-commodity-view-frame.service'//'./allocate-commodity-view-frame.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-allocate-commodity-view-frame',
  templateUrl: './allocate-commodity-view-frame.component.html',
  styleUrls: ['./allocate-commodity-view-frame.component.css']
})
export class AllocateCommodityViewFrameComponent implements OnInit {

  buAllocation = [];
  commodityAllocation = [];
  @Output() editEvent = new EventEmitter<any>();
  @Input() commodityAllocationList: any;
  @Input() quarterId: number;
  @Input() targetIdQuarter:any;
  @Output() valueChange = new EventEmitter<any>();
  constructor(private allocateCommodityViewFrameService: AllocateCommodityViewFrameService) { }

  ngOnInit(): void {
    this.buAllocation = this.commodityAllocationList.buAllocation;
    this.commodityAllocation = this.commodityAllocationList.commodityAllocation;
    console.log('---', this.commodityAllocationList+"  this.targetIdQuarter "+this.targetIdQuarter);
  //   this.allocateCommodityViewFrameService.getAllocationEditdata(this.targetIdQuarter).subscribe((data:any)=>{          
      
  //       this.commodityAllocationList.editable = false;
  //       this.commodityAllocationList.commodityViewMode = true;
  //       this.commodityAllocationList=data;      
  //       this.editEvent.emit(data);
  //   console.log(" api data "+JSON.stringify(data)+" this.commodityAllocationList.editable"+  this.commodityAllocationList.editable+" this.commodityAllocationList.commodityViewMode"+ this.commodityAllocationList.commodityViewMode);
    
  // }, error =>{
  //   ////console.log(" error : ", error);
  // }
  //  )
  
    this.valueChange.emit(true);
  
  }

  onEdit(data: any) {
    this.commodityAllocationList.editable = !this.commodityAllocationList.editable;
    this.commodityAllocationList.commodityViewMode = !this.commodityAllocationList.commodityViewMode;
    //console.log("edit targetid"+ JSON.stringify(this.commodityAllocationList));
    let targetid=this.commodityAllocationList.buAllocation[0].targetId;
    console.log("edit targetid"+ targetid);
    this.allocateCommodityViewFrameService.getAllocationEditdata(targetid).subscribe((data:any)=>{          
      //this.commodityAllocationList=data;      
    //let cmdindex=this.commodityAllocation.findIndex(x=>x.commoitesList="commoditiesList");
    
      this.editEvent.emit(data);
    console.log(" api data "+JSON.stringify(data));
   // console.log("before this.valueChange edit"+ JSON.stringify( this.valueChange));
    this.valueChange.emit(true);
   // console.log("after this.valueChange edit"+JSON.stringify( this.valueChange));
  }, error =>{
    ////console.log(" error : ", error);
  }
    )
//console.log('---',JSON.stringify( this.commodityAllocationList));  
}
}
