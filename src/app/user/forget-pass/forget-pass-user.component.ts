﻿import { Component, Input } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../service/shared.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-forget-pass-user',
    templateUrl: './forget-pass-user.component.html',
    styleUrls: ['./forget-pass-user.component.css']

})
export class ForgetPassUserComponent {
    /*form: FormGroup;*/
    regexPatternPass = /^[a-zA-Z0-9]{6,100}$/;
    @Input() data: any;

    showErrorTxtPassOld: boolean = false;
    errorTxtPassOld: string = "";
    showErrorTxtRePass: boolean = false;
    errorTxtRePass: string = "";
    showErrorTxtPass: boolean = false;
    errorTxtPass: string="";

    description: string="";
    notis: string="";
    user: any;
    // data: any;
    showMes: boolean=false;
    gioiTinhList: any;
    constructor(

        private http: HttpClient,
        private toastr: ToastrService,
        private sharedService: SharedService,
        public modal: NgbActiveModal
    ) {

        // this.data = data;
    }

    ngOnInit() {
        this.notis = '';

        this.showMes = false;

        this.refreshUser();

        this.gioiTinhList = [{ value: 1, viewValue: "Nam" },
        { value: 2, viewValue: "Nữ" },
        { value: 3, viewValue: "Khác" }]

    }

    checkChangePassOld() {
        var check = this.sharedService.checkChangeProperty(this.regexPatternPass, this.user, "passwordOld", "txt-pass-old", this, "showErrorTxtPassOld");

        if (!check) {
            this.errorTxtPassOld = "Mật khẩu tối thiểu 6 ký tự, tối đa 100 ký tự, chỉ viết liền, không dấu";
        }
        return check;

    }

    checkChangePass() {
        var check = this.sharedService.checkChangeProperty(this.regexPatternPass, this.user, "password", "txt-pass", this, "showErrorTxtPass");

        if (!check) {
            this.errorTxtPass = "Mật khẩu tối thiểu 6 ký tự, tối đa 100 ký tự, chỉ viết liền, không dấu";
        }
        return check;

    }

    checkChangeRePass() {

        let txtInput = document.getElementsByName("txt-repass");
        if (this.user.password == this.user.rePassword && this.user.rePassword != "") {
            txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtRePass = false;
            return true;
        } else {
            txtInput[0].className += " is-invalid";
            this.showErrorTxtRePass = true;

            this.errorTxtRePass = "Nhập lại mật khẩu không đúng";
            return false;
        }
    }

    checkValid() {

        var validPass = true;
        var validRePass = true;

        validPass = this.checkChangePass();
        validRePass = this.checkChangeRePass()

        var validPassOld = this.checkChangePassOld()

        if (validPass &&
            validRePass && validPassOld) {
            return true;
        } else {
            return false;
        }

    }

    refreshUser() {
        this.user = new Object();

        this.user.password = "";
        this.user.passwordOld = "";
        this.user.rePassword = "";

    }

    save() {
        var valid = this.checkValid();
        if (valid) {

            this.user.userId = localStorage.getItem("userId");
            this.user.username = localStorage.getItem("username");

            this.http.post<any>('http://10.1.11.110:5017/' + 'user/changepass',
                this.user, this.sharedService.httpOptions)
                .subscribe(response => {

                    if (response.data.success) {
                        this.toastr.success('Đổi mật khẩu thành công', 'Thông báo');

                        this.modal.close("ok");
                    } else {

                        this.toastr.error('Đổi mật khẩu thất bại ', 'Thông báo');

                    }

                });

        }
    }

    showPass1() {
        this.sharedService.showPass('#exampleInputPassword11');

    }

    showPass2() {
        this.sharedService.showPass('#exampleInputPassword12');

    }

    showPass3() {
        this.sharedService.showPass('#exampleInputPassword13');

    }

    close() {

        this.modal.close();

    }

}