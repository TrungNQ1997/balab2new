import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberReport'
})
export class NumberReportPipe implements PipeTransform {

  transform(value: number): string {
    var text = "";
    var lang = localStorage.getItem("language");

    if (value) {
      if (lang) {
        if (lang == "vi") {
          text = value.toString().replace('.', ',');
        } else {
          text = value.toString();
        }
      } else {
        text = value.toString().replace('.', ',');
      }

    }
    return text
  }

}
