import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'allocation'
})
export class AllocationPipe implements PipeTransform {

  transform(value: number): any {
    if (value < 0) {
      return '(' + (value.toString().substr(1)) + ')';
    } else {
      return value;
    }
  }
}
