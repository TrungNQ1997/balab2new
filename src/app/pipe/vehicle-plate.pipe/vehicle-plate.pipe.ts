import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehiclePlate'
})
export class VehiclePlatePipe implements PipeTransform {

  transform(value: string): string {
    const vehiclePlatePattern = /([a-zA-Z0-9]{3})(\d{0,})/;
    const vehiclePlatePattern5 = /([a-zA-Z0-9]{3})([a-zA-Z0-9]{3})([a-zA-Z0-9]{0,})/;

    if (!value) {
      return '';
    }
    var formattedNumber = "";
if(value.length > 7)
{
  formattedNumber =  value.replace(vehiclePlatePattern5, '$1 $2.$3');
} else {
 formattedNumber =  value.replace(vehiclePlatePattern, '$1 $2');
}

   
    return formattedNumber;
  }

}
