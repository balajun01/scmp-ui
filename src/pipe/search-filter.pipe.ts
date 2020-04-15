import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(arr: any[], args: any = ''): any {
    let filteredArray = arr.filter((item) => {
      return item.description.toLowerCase().includes(args.trim().toLowerCase());
    });
    return filteredArray;
  }

}
