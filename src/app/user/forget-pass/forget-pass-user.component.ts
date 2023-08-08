import { Component, Input } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../service/shared.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
@Component({
    selector: 'app-forget-pass-user',
    templateUrl: './forget-pass-user.component.html',
    styleUrls: ['./forget-pass-user.component.css']

})
export class ForgetPassUserComponent {
    regexPatternPass = /^[a-zA-Z0-9]{6,100}$/;
    @Input() data: any;

    description: string = "";
    notis: string = "";
    user: any;
    showMes: boolean = false;
    gioiTinhList: any;
    formControlPassOld: FormControl = new FormControl;
    formControlPass: FormControl = new FormControl;
    formControlRePass: FormControl = new FormControl

    constructor(

        private http: HttpClient,
        private toastr: ToastrService,
        private sharedService: SharedService,
        public modal: NgbActiveModal
    ) {

    }

    ngOnInit() {
        this.notis = '';
        this.showMes = false;
        this.refreshUser();

        this.gioiTinhList = [{ value: 1, viewValue: "Nam" },
        { value: 2, viewValue: "Nữ" },
        { value: 3, viewValue: "Khác" }]
        this.genValidFormControl()
    }

    genValidFormControl() {

        this.formControlPassOld = new FormControl(this.user.passwordOld, [
            Validators.required,
            Validators.pattern(this.sharedService.regexAPass)
        ]);
        this.formControlPass = new FormControl(this.user.password, [
            Validators.required,
            Validators.pattern(this.sharedService.regexAPass)
        ]);
        this.formControlRePass = new FormControl(this.user.rePassword, [
            Validators.required,
            this.checkConditionRepass.bind(this)

        ]);
    }

    checkConditionRepass(formControl: AbstractControl) {
        if (this.formControlPass.value != formControl.value) {
            return {
                required: true
            };

        } else {
            return null
        }
    }

    checkValid() {

        this.formControlRePass.updateValueAndValidity();
        this.formControlPass.updateValueAndValidity();

        if (this.formControlPass.valid && this.formControlPassOld.valid && this.formControlRePass.valid) {
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

            this.http.post<any>(this.sharedService.url + 'user/changepass',
                this.user, this.sharedService.httpOptions)
                .subscribe(response => {

                    if (!response.data.error) {
                        this.toastr.success('Đổi mật khẩu thành công', 'Thông báo');

                        this.modal.close("ok");
                    } else {

                        this.toastr.error('Đổi mật khẩu thất bại ', 'Thông báo');

                    }

                });

        }
    }

    close() {

        this.modal.close();

    }

}