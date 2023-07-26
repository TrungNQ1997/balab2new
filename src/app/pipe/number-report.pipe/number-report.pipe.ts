import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberReport'
})
export class NumberReportPipe implements PipeTransform {

  transform(value: any, args?: any): any {
var text = "";
if(value){
return value.toString().replace('.',',');
} else {
  return ""
}

    return null;
  }

}
