import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public regexAPass = '[a-zA-Z0-9]{6,100}';
  //public url = 'http://10.1.11.110:5017/';
  public url = 'http://localhost:6017/';
  private secretKey = '2b7e151628aed2a6abf7158809cf4f3c'; // Khóa AES 256 bits (32 bytes)
  private iv = '000102030405060708090a0b0c0d0e0f'; // IV 128 bits (16 bytes)

  private isNavbarVisibleSubject: Subject<boolean> = new Subject<boolean>();
  public isNavbarVisible$ = this.isNavbarVisibleSubject.asObservable();
  public CompanyID = 15076;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'CompanyID': this.CompanyID
    })
  };
  private localStorageKey = 'isNavbarVisible';

  constructor(private http: HttpClient) {
    const storedValue = localStorage.getItem(this.localStorageKey);
    this.isNavbarVisibleSubject.next(storedValue ? JSON.parse(storedValue) : true);
  }

  public getHeaderSecurity() {
    var httpOptiob = new Object();
    var dateNow = new Date();
    dateNow.setDate((new Date()).getDate() + 1);
    const payload = {
      UserID: 1,
      Token: "EF4A9073-58AB-4D2D-93C1-6936093EE015",
      CompanyID: this.CompanyID,
      ExpiredDate: this.getDateExactly(dateNow)
    };
    var dataEncryp = JSON.stringify(payload);
    const encryptedPayload = CryptoJS.AES.encrypt(dataEncryp, CryptoJS.enc.Hex.parse(this.secretKey), {
      iv: CryptoJS.enc.Hex.parse(this.iv)
    }).toString();

    httpOptiob = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'CompanyID': this.CompanyID,
        'SecurityData': encryptedPayload
      })
    };
    return httpOptiob
  }

  public getHeaderSecurityUser() {
    var httpOptiob = new Object();
    var dateNow = new Date();
    dateNow.setDate((new Date()).getDate() + 1);
    const payload = {
      UserID: 1,
      Token: "EF4A9073-58AB-4D2D-93C1-6936093EE015",
      CompanyID: this.CompanyID,
      ExpiredDate: this.getDateExactly(dateNow)
    };
    var dataEncryp = JSON.stringify(payload);
    const encryptedPayload = CryptoJS.AES.encrypt(dataEncryp, CryptoJS.enc.Hex.parse(this.secretKey), {
      iv: CryptoJS.enc.Hex.parse(this.iv)
    }).toString();

    httpOptiob = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'CompanyID': this.CompanyID,
        'SecurityData': encryptedPayload
      })
    };
    return httpOptiob
  }

  public setIsNavbarVisible(isVisible: boolean): void {
    this.isNavbarVisibleSubject.next(isVisible);
    localStorage.setItem(this.localStorageKey, JSON.stringify(isVisible));
  }

  public getDateExactly(yourDate: Date) {
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000))
    return yourDate.toISOString().split('T')[0]
  }

  public getCookie(cname: any) {
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

    return this.http.post<any>(this.url + 'user/checklogingetrole',
      data, this.getHeaderSecurityUser())

  }

  public callGetRole(token: any): Observable<any> {
    var data: any;
    data = {
      "userId": localStorage.getItem("userId"),
      "menuId": "1"
    }

    return this.http.post<any>(this.url + 'user/getrole',
      data, this.getHeaderSecurityUser())

  }

  public callAddUser(user: any): Observable<any> {
    user.userId = '2';
    return this.http.post<any>(this.url + 'user/adduser',
      user, this.getHeaderSecurityUser())

  }

  public checkChangeProperty(regex: any, objCheck: any, property: string, nameControl: string, vm: any, propertyShowLabelError: any) {
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

  public showPass(name: string) {
    let password = document.querySelector(name);
    if (password) {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
    }
  }

}