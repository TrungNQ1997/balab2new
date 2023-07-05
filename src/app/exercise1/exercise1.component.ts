import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exercise1',
  templateUrl: './exercise1.component.html',
  styleUrls: ['./exercise1.component.scss']
})
export class Exercise1Component implements OnInit {

  numberDiv: number = 6;
  arrayDiv: number[] = [];
  constructor() { }

  ngOnInit() {
    for (var i = 1; i <= this.numberDiv; i++) {
      this.arrayDiv.push(i);
    }
  }

}
