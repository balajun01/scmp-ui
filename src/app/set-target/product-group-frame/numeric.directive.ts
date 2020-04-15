import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNumeric]'
})
export class NumericDirective {
  oldValue: string;

  constructor(private elemRef: ElementRef) { }

  @HostListener('keypress', ['$event'])
  onkeyPress(event: any) {
    if (event.keyCode > 31 && event.keyCode !== 46 && event.keyCode !== 45
      && (event.keyCode < 48 || event.keyCode > 57)) {
      return false;
    }
    return true;
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: any) {
    if ((Number(this.elemRef.nativeElement.value) > 9999
    || Number(this.elemRef.nativeElement.value) < -9999)
    && event.keyCode !== 46 && event.keyCode !== 8) {
      event.preventDefault();
      this.elemRef.nativeElement.value = this.oldValue;
    }
    this.oldValue = this.elemRef.nativeElement.value;
  }

  @HostListener('blur', ['$event'])
  onEnter(event: any) {
    let initalValue = this.elemRef.nativeElement.value;
    if (initalValue && initalValue < 0) {
        initalValue = parseFloat(parseFloat(initalValue).toFixed(4));
      } else if (initalValue && initalValue <= 9999) {
        initalValue = parseFloat(parseFloat(initalValue).toFixed(4));
      }
    this.elemRef.nativeElement.value = initalValue;
    this.oldValue = this.elemRef.nativeElement.value;
    if (initalValue !== this.elemRef.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
