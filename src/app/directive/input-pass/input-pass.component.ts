import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-pass',
  templateUrl: './input-pass.component.html',
  styleUrls: ['./input-pass.component.css']
})
export class InputPassComponent implements OnInit {
  @Input() password: string = "";
  @Input() name: string = "";
  @Input() formControl: FormControl = new FormControl;
  @Input() inputName: string = "";
  showPassword: boolean = false;
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() formControlChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() passwordChange: EventEmitter<string> = new EventEmitter<string>();

  onPasswordChange(value: string) {
    this.password = value;
    this.passwordChange.emit(this.password);
    this.formControlChange.emit(this.formControl);
  }
  constructor() { }

  ngOnInit() {
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
