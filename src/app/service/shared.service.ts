import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
@Injectable()
export class SharedService {

 public regexAPass = '[a-zA-Z0-9]{6,100}';
  private isNavbarVisibleSubject: Subject<boolean> = new Subject<boolean>();
  public isNavbarVisible$ = this.isNavbarVisibleSubject.asObservable();
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    })
  };
  private localStorageKey = 'isNavbarVisible'; // Key trong LocalStorage

  constructor(private http: HttpClient) {
    // Khởi tạo giá trị ban đầu từ LocalStorage
    const storedValue = localStorage.getItem(this.localStorageKey);
    this.isNavbarVisibleSubject.next(storedValue ? JSON.parse(storedValue) : true);
  }

  public setIsNavbarVisible(isVisible: boolean): void {
    this.isNavbarVisibleSubject.next(isVisible);
    localStorage.setItem(this.localStorageKey, JSON.stringify(isVisible)); // Lưu vào LocalStorage
  }

  public getCookie(cname:any) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  public callCheckLoginAndGetRole(token: any): Observable<any> {

    var data: any;
    data = {
      "token": token,
      "menuId": "1"
    }

    return this.http.post<any>('http://10.1.11.110:5017/' + 'user/checklogingetrole',
      data, this.httpOptions)

  }

  public callGetRole(token: any): Observable<any> {

    var data: any;
    data = {
      "userId": localStorage.getItem("userId"),
      "menuId": "1"
    }

    return this.http.post<any>('http://10.1.11.110:5017/' + 'user/getrole',
      data, this.httpOptions)

  }

  public callAddUser(user: any): Observable<any> {

    user.userId = '2';

    return this.http.post<any>('http://10.1.11.110:5017/' + 'user/adduser',
      user, this.httpOptions)

  }

  public checkChangeProperty(regex:any, objCheck:any, property:string, nameControl:string, vm:any, propertyShowLabelError:any) {
    var isValid = regex.test(objCheck[property]);
    let txtInput = document.getElementsByName(nameControl);
    if (isValid) {
      txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
      vm[propertyShowLabelError] = false;
      return true;
    } else {
      txtInput[0].className += " is-invalid";
      vm[propertyShowLabelError] = true;

      return false;

    }

  }


  public showPass(name:string) {
    let password = document.querySelector(name);
    if (password) {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
    }
  }

}