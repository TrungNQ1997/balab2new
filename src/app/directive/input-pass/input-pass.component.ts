import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-pass',
  templateUrl: './input-pass.component.html',
  styleUrls: ['./input-pass.component.css']
})
export class InputPassComponent implements OnInit {
  @Input() password: string="";
  @Input() name: string="";
  @Input() checkVaild: any;
  @Input() inputName: string="";
  showPassword: boolean = false;
 
  @Output() checkVaildChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() passwordChange: EventEmitter<string> = new EventEmitter<string>();

  onPasswordChange(value: string) {
    this.password = value;
    this.passwordChange.emit(this.password);
    this.checkVaildChange.emit(this.checkVaild);
  }
  constructor() { }

  ngOnInit() {
  }
  checkValid(){
console.log(this.password);
  }
  showPass1(){
    console.log(this.password);
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
