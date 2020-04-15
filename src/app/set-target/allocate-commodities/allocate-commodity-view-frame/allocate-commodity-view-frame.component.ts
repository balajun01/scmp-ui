import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AllocateCommodityViewFrameService } from './allocate-commodity-view-frame.service';
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

  constructor(private allocateCommodityViewFrameService: AllocateCommodityViewFrameService) { }

  ngOnInit(): void {
    this.buAllocation = this.commodityAllocationList.default[0].buAllocation;
    this.commodityAllocation = this.commodityAllocationList.default[1].commodityAllocation;
    console.log('---', this.commodityAllocationList);

  }

  onEdit(data: any) {
    this.commodityAllocationList.editable = !this.commodityAllocationList.editable;
    this.commodityAllocationList.commodityViewMode = !this.commodityAllocationList.commodityViewMode;
    this.editEvent.emit(this.commodityAllocationList);
    console.log('---', data);
  }
}
