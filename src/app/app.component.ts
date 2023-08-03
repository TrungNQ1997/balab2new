import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  birthdayFrom = "";
  title = 'BAUserManager';
  private curLang: string = 'vi';
 
  getCurLang(): string {
    return this.curLang;
  }

  setCurLang(value: string) {
    this.curLang = value;
  }
}
