
import { Component, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-multiselect-dropdown',
  templateUrl: './multiselect-dropdown.component.html',
  styleUrls: ['./multiselect-dropdown.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiselectDropdownComponent),
      multi: true
    }
  ]
})
export class MultiselectDropdownComponent implements OnInit, OnChanges, ControlValueAccessor {
   options:any[]; 
  @Input() settings;
  @Input() reset;
  @Input() theme;
  @Input() menuPosition: string = 'bottom-left';
  @Input() isDisabled?: boolean = false;
  @Input() showClear?: boolean = false;

  searchTxt: string = '';
  checkedList: any[];

  constructor() { }

  ngOnInit() {
    console.log("options",this.options);
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
  }

  removeItemFromList(option: any) {
    let index = this.checkedList.findIndex((item: any) => {
      return item.releaseQuarterId === option.releaseQuarterId;
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
    this.options.map((item) => {
      if (item.releaseQuarterId === option.releaseQuarterId) {
        item.checked = false;
      }
    });
    this.propagateChange(this.checkedList);
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


