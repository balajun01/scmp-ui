import { Component, OnInit, Input,Output, forwardRef, EventEmitter,OnChanges, SimpleChanges,ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-multiselect-productgroup',
  templateUrl: './multiselect-productgroup.component.html',
  styleUrls: ['./multiselect-productgroup.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectProductgroupComponent),
      multi: true
    }
  ]
})

export class MultiselectProductgroupComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() options:any[]; 
  @Input() settings;
  @Input() reset;
  @Input() theme;
  @Input() menuPosition: string = 'bottom-left';
  @Input() isDisabled?: boolean = false;
  @Input() showClear?: boolean = false;
  @Output() checkProductList = new EventEmitter<any[]>();
  maxItemToDisplay:number=2;
  

  searchTxt: string = '';
  checkedList: any[];

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this._resetCheckedList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reset'] && !changes['reset'].firstChange && (changes['reset'].currentValue !== changes['reset'].previousValue)) {
      this._resetCheckedList();
    }
  }

  addItemToList(option: any) {
    this.checkedList.push(option);
    this.propagateChange(this.checkedList);
    console.log(" this.checkedList", this.checkedList);
    this.checkProductList.emit( this.options);
  }

  removeItemFromList(option: any) {
    let index = this.checkedList.findIndex((item: any) => {
      return item.prodGroupId === option.prodGroupId;
    });
    this.checkedList.splice(index, 1);
    this.propagateChange(this.checkedList);
  }

  public clearOptions = () => {
    this.options.map((item) => {
        item.checked = false;
    });
    this.checkedList = [];
    this.propagateChange(this.checkedList);
  }

  public removeSelected = (index, option) => {
    this.checkedList.splice(index, 1);
    option.checked=false;
    this.options.push(option);
    this.propagateChange(this.checkedList);
    this.checkProductList.emit( this.options);
  }

  public onChangeOfOption = (option) => {
    if (option.checked) {
      this.addItemToList(option);
    } else {
      this.removeItemFromList(option);
    }
  }

  _resetCheckedList = () => {
    this.checkedList = [];
    this.propagateChange(this.checkedList);
  }

  writeValue(value: any) { }

  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

}



