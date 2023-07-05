﻿import { Component, Input } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../service/shared.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']

})
export class EditUserComponent {
    /*form: FormGroup;*/
    @Input() data: any;
    regexPatternUsername = /^[a-zA-Z0-9]{1,50}$/;
    regexPatternPass = /^[a-zA-Z0-9]{6,100}$/;
    regexPatternSdt = /^[0-9]{1,10}$/;
    regexPatternEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,200}$/;
    // phoneNumberForm: FormGroup;
    errorTxtUsername: string="";
    isLoadList: boolean = false;
    showErrorTxtNgaySinh: boolean = false;
    errorTxtNgaySinh: string="";
    showErrorTxtSdt: boolean = false;
    errorTxtSdt: string="";
    showErrorTxtTen: boolean = false;
    errorTxtTen: string="";
    showErrorTxtRePass: boolean = false;
    errorTxtRePass: string="";
    showErrorTxtPass: boolean = false;
    errorTxtPass: string="";
    showErrorTxtUsername: boolean=false;
    showErrorTxtMail: boolean = false;
    errorTxtMail: string="";
    description: string="";
    notis: string="";
    user: any;
    phone:any;
    // data: any;
    showMes: boolean=false;
    disabledAdd:boolean = true;
    gioiTinhList: any;
    constructor(
 
        private http: HttpClient,
        private toastr: ToastrService,
        private sharedService: SharedService,
        public modal: NgbActiveModal,
        
    ) {
        // this.phoneNumberForm = new FormGroup({
        //     phoneNumber: new FormControl('', [Validators.required, Validators.pattern(this.regexPatternSdt)])
        //   });
        // this.data = data;
    }

    ngOnInit() {
        this.notis = '';
        this.showErrorTxtUsername = false;
        this.errorTxtUsername = '';
        this.showMes = false;
        if (this.data.statusForm == 'edit') {
            this.user = this.data.data;
            this.user.phone = this.user.phone.trim();
            this.user.birthday = new Date(this.user.birthday);
            this.user.username = this.user.username.trim();
            this.user.email = this.user.email.trim();
        } else if (this.data.statusForm == 'add') {
            this.refreshUser();
        }

        this.gioiTinhList = [{ value: 1, viewValue: "Nam" },
        { value: 2, viewValue: "Nữ" },
        { value: 3, viewValue: "Khác" }]

    }

    checkChangeUsername() {

        var check = this.sharedService.checkChangeProperty(this.regexPatternUsername, this.user, "username", "txt-username", this, "showErrorTxtUsername");

        if (!check) {
            this.errorTxtUsername = "Tên đăng nhập từ 1 đến 50 ký tự, chỉ viết liền, không dấu"
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

    checkChangeNgaySinh() {

        let txtInput = document.getElementsByName("txt-ngay-sinh");
        if (this.user.birthday) {

            var t1 = new Date(this.user.birthday)
            if ((new Date()).getFullYear() - t1.getFullYear() >= 18) {
                txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
                this.showErrorTxtNgaySinh = false;
                return true;
            } else {
                txtInput[0].className += " is-invalid";
                this.showErrorTxtNgaySinh = true;

                this.errorTxtNgaySinh = "Người dùng phải đủ 18 tuổi trở lên";
                return false;
            }


        } else {

            txtInput[0].className += " is-invalid";
            this.showErrorTxtNgaySinh = true;

            this.errorTxtNgaySinh = "Ngày sinh không được để trống";
            return false;
        }
    }

    checkChangeSdt() {

        var check = this.sharedService.checkChangeProperty(this.regexPatternSdt, this.user, 'phone', "txt-sdt", this, "showErrorTxtSdt");

        if (!check) {
            this.errorTxtSdt = "Số điện thoại tối đa 10 ký tự, chỉ nhập số";
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
    checkChangeMail() {
        var isValid = this.regexPatternEmail.test(this.user.email);
        let txtInput = document.getElementsByName("txt-mail");

        if (this.user.email) {
            if (isValid) {
                txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
                this.showErrorTxtMail = false;
            } else {
                txtInput[0].className += " is-invalid";
                this.showErrorTxtMail = true;
                this.errorTxtMail = "Email phải đúng định dạng, chỉ viết liền, không dấu"
                return false;
            }
        } else {
            txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtMail = false;
        }
        return true;
    }

    checkChangeTen() {

        let txtInput = document.getElementsByName("txt-ten");

        if (this.user.fullName) {

            txtInput[0].className = txtInput[0].className.replace(/ is-invalid/g, "");
            this.showErrorTxtTen = false;
            return true;
        } else {
            txtInput[0].className += " is-invalid";
            this.showErrorTxtTen = true;
            this.errorTxtTen = "Họ tên không được để trống"
            return false;
        }

    }

    checkValid() {

        var validNgaySinh = this.checkChangeNgaySinh()
        var validUsername = this.checkChangeUsername()
        var validMail = this.checkChangeMail()
        var validPass = true;
        var validRePass = true;
        if (this.data.statusForm == 'add') {
            validPass = this.checkChangePass();
            validRePass = this.checkChangeRePass()
        }
        var validSdt = this.checkChangeSdt()
        var validTen = this.checkChangeTen()

        if (validNgaySinh && validUsername
            && validMail && validPass &&
            validRePass && validSdt && validTen) {
                this.disabledAdd = false;
                return true;

        } else {
            this.disabledAdd = true;
            return false;
        }

    }

    refreshUser() {
        this.user = new Object();

        this.user.fullName = "";
        this.user.sexId = 1;
        this.user.isAdmin = true;
        this.user.isActive = true;
        this.user.birthday = "";
        this.user.email = "";
        this.user.username = "";
        this.user.password = "";
        this.user.rePassword = "";
    }

    save() {
        var valid = this.checkValid();
        if (valid) {

            if (this.data.statusForm == 'add') {

                this.sharedService.callAddUser(this.prepareData()).subscribe(response => {

                    if (response.data.error == false) {
                        this.toastr.success('Thêm người dùng thành công', 'Thông báo');

                        this.modal.close("ok");
                    } else {
                        if (response.data.message.includes("UNIQUE KEY")) {
                            this.toastr.error('Username bị trùng', 'Thêm người dùng thất bại');
                        } else {
                            this.toastr.error('Thêm người dùng thất bại ', 'Thông báo');
                        }

                    }

                });

            } else if (this.data.statusForm == 'edit') {

                this.user.user_id = '2';

                this.http.post<any>('http://10.1.11.110:5017/' + 'user/edituser',
                    this.prepareData(), this.sharedService.httpOptions)
                    .subscribe(response => {

                        if (response.data.error == false) {
                            this.toastr.success('Sửa người dùng thành công', 'Thông báo');
                            this.modal.close("ok");
                        } else {
                            this.toastr.error('Sửa người dùng thất bại ', 'Thông báo');
                        }

                    });

            }
        }
    }

    prepareData() {
        if (this.user.birthday) {

            const offset = new Date(this.user.birthday).getTimezoneOffset();
            this.user.birthday = new Date(new Date(this.user.birthday).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];


            // this.user.ngay_sinh = (new Date(this.user.ngay_sinh)).toLocaleDateString();
        }
        return this.user
    }

    saveAdd() {
        var valid = this.checkValid();
        if (valid) {

            if (this.data.statusForm == 'add') {

                this.sharedService.callAddUser(this.prepareData()).subscribe(response => {

                    if (response.data.error == false) {
                        this.toastr.success('Thêm người dùng thành công', 'Thông báo');
                        this.isLoadList = true;
                        this.refreshUser();
                    } else {
                        if (response.data.message.includes("UNIQUE KEY")) {
                            this.toastr.error('Username bị trùng', 'Thêm người dùng thất bại');
                        } else {
                            this.toastr.error('Thêm người dùng thất bại ', 'Thông báo');
                        }

                    }

                });

            }

        }
    }

    showPass1() {

        this.sharedService.showPass('#exampleInputPassword11');

    }

    showPass2() {
        this.sharedService.showPass('#exampleInputPassword12');

    }

    close() {
        if (this.isLoadList) {
            this.modal.close("ok");
        } else {
            this.modal.close();
        }

    }

}