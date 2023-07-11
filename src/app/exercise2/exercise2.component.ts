import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exercise2',
  templateUrl: './exercise2.component.html',
  styleUrls: ['./exercise2.component.scss']
})
export class Exercise2Component implements OnInit {

  numberDiv: number = 10;
  arrayDiv: number[] = [];
  constructor() { }

  ngOnInit() {
    for (var i = 1; i <= this.numberDiv; i++) {
      this.arrayDiv.push(i);
    }

    var inputContainer = document.getElementsByClassName('input-container');

    
    // for (var i = 0; i < this.arrayDiv.length; i++) {
    //   var input = document.createElement('input');
    //   input.type = 'number';
    //   input.value = this.arrayDiv[i].toString();
    //   input.setAttribute('oninput', 'updateArrayValue(' + i + ', this.value)');
    //   (inputContainer[0] as HTMLDivElement).appendChild(input);
    // }
   
  }
      updateArrayValue(index:any, value:any) {
    this.arrayDiv[index] = Number(value);
  }

  setValueInput(event:any,index:any){
    console.log(1)
     this.arrayDiv[index] = Number(event.currentTarget.value);

  }

  getArr(){
   let u =  document.getElementsByClassName("input-arr");
   for(let i = 0;i<this.numberDiv;i++){
    
   }
   console.log(this.arrayDiv);
    
  }

}
