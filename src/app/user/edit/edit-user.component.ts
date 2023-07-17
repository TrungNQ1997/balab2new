import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../service/shared.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']

})
export class EditUserComponent {
    /*form: FormGroup;*/
    @Input() data: any;
    inputField: any;
    formControlPhone: FormControl = new FormControl;
    formControlEmail: FormControl = new FormControl;
    // formControlUsername: FormControl = new FormControl;
    formControlBirthday: FormControl = new FormControl;
    formControlPass: FormControl = new FormControl;
    formControlFullname: FormControl = new FormControl;
    formControlRePass: FormControl = new FormControl;
    @ViewChild('inputFieldRef') inputFieldRef!: ElementRef;
    
    regexASdt = '[0-9]{1,10}';
    regexAUsername = '[a-zA-Z0-9]{1,50}';
    regexAPass = '[a-zA-Z0-9]{6,100}';
    regexAEmail = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,200}';
    regexPatternUsername = /^[a-zA-Z0-9]{1,50}$/;
    isLoadList: boolean = false;
     
    user: any;
    showMes: boolean = false;
    disabledAdd: boolean = true;
    gioiTinhList: any;
    isErrorUsername:boolean = false;
    errorUsername:string = '';

    constructor(

        private http: HttpClient,
        private toastr: ToastrService,
        private sharedService: SharedService,
        public modal: NgbActiveModal,
        private fb: FormBuilder
    ) {

    }

    ngOnInit() {

        this.inputField = ViewChild('inputFieldRef')
         
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

        this.genValidFormControl()

        this.gioiTinhList = [{ value: 1, viewValue: "Nam" },
        { value: 2, viewValue: "Nữ" },
        { value: 3, viewValue: "Khác" }]

    }

    checkChangeUsername(){
        if(!this.user.username){
            this.isErrorUsername = true;
            this.errorUsername="Tên đăng nhập không được bỏ trống!"
        } else {
            if(this.regexPatternUsername.test(this.user.username)){
                this.isErrorUsername = false;
            } else {
                this.isErrorUsername = true;
                this.errorUsername="Tên đăng nhập từ 1 đến 50 ký tự, chỉ viết liền, không dấu"
            }
        }
    }

    genValidFormControl() {

        this.formControlPhone = new FormControl(this.user.phone, [
            Validators.required,
            Validators.pattern(this.regexASdt)
        ]);
        this.formControlEmail = new FormControl(this.user.email, [
            Validators.pattern(this.regexAEmail)
        ]);
        // this.formControlUsername = new FormControl({
        //     value: this.user.phone,
        //     disabled: this.data.statusForm == 'edit'
        // }, [
        //     Validators.required,
        //     Validators.pattern(this.regexAUsername)
        // ]);
        this.formControlBirthday = new FormControl(this.user.birthday, [
            Validators.required,
            this.emailConditionallyRequiredValidator
        ]);
        this.formControlPass = new FormControl(this.user.password, [
            Validators.required,
            Validators.pattern(this.regexAPass)
        ]);
        this.formControlRePass = new FormControl(this.user.rePassword, [
            Validators.required,
            this.checkConditionRepass.bind(this)

        ]);
        this.formControlFullname = new FormControl(this.user.fullName, [
            Validators.required

        ]);
    }

    checkConditionRepass(formControl: AbstractControl) {
        // console.log(this);
        if (this.formControlPass.value != formControl.value) {
            return {
                required: true
            };

        } else {
            return null
        }
    }

    emailConditionallyRequiredValidator(formControl: AbstractControl) {
 
        if (formControl.value) {

            var t1 = new Date(formControl.value)
            if ((new Date()).getFullYear() - t1.getFullYear() >= 18) {
                return null
            } else {
                return {
                    not18: true
                };
            }
        } else {
            return {
                required: true
            };
        }
 
    }
    checkValidBirthday(control: FormControl) {
        const value: string = control.value;
        if (value && value !== 'custom') {
            return { customCondition: true };
        }
        return null;
    }
     
    checkValidAfter() {
        this.formControlRePass.updateValueAndValidity();
        this.formControlPass.updateValueAndValidity();

        if (this.formControlBirthday.valid && this.formControlEmail.valid && this.formControlPhone.valid
            && (this.data.statusForm == 'edit' || (this.formControlPass.valid && this.formControlRePass.valid)) && this.formControlFullname.valid 
            // && !this.formControlUsername.invalid
            ) {
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
         
        if (this.data.statusForm == 'add') {

            this.sharedService.callAddUser(this.prepareData()).subscribe(response => {

                if (response.data.error == false) {
                    this.toastr.success('Thêm người dùng thành công', 'Thông báo');

                    this.modal.close("ok");
                } else {
                    this.user.birthday = this.user.birthdayOld;
                    if (response.data.message.includes("UNIQUE KEY")) {
                        this.toastr.error('Username bị trùng', 'Thêm người dùng thất bại');
                    } else {
                        this.toastr.error('Thêm người dùng thất bại ', 'Thông báo');
                    }

                }

            });

        } else if (this.data.statusForm == 'edit') {

            this.user.user_id = '2';

            this.http.post<any>(this.sharedService.url + 'user/edituser',
                this.prepareData(), this.sharedService.httpOptions)
                .subscribe(response => {

                    if (response.data.error == false) {
                        this.toastr.success('Sửa người dùng thành công', 'Thông báo');
                        this.modal.close("ok");
                    } else {
                        this.user.birthday = this.user.birthdayOld;
                        this.toastr.error('Sửa người dùng thất bại ', 'Thông báo');
                    }

                });

        }
        // }
    }

    prepareData() {
        if (this.user.birthday) {
            this.user.birthdayOld = this.user.birthday;
            const offset = new Date(this.user.birthday).getTimezoneOffset();
            this.user.birthday = new Date(new Date(this.user.birthday).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
   }
        if (this.data.statusForm == 'add') {
            this.user.creator = localStorage.getItem("userId");
            this.user.editor = localStorage.getItem("userId");
        } else {
            this.user.editor = localStorage.getItem("userId");
        }
        return this.user
    }

    saveAdd() {
       
        if (this.data.statusForm == 'add') {

            this.sharedService.callAddUser(this.prepareData()).subscribe(response => {

                if (response.data.error == false) {
                    this.toastr.success('Thêm người dùng thành công', 'Thông báo');
                    this.isLoadList = true;
                    this.refreshUser();
                } else {
                    this.user.birthday = this.user.birthdayOld;
                    if (response.data.message.includes("UNIQUE KEY")) {
                        this.toastr.error('Username bị trùng', 'Thêm người dùng thất bại');
                    } else {
                        this.toastr.error('Thêm người dùng thất bại ', 'Thông báo');
                    }

                }

            });
 
        }
    }
 
    close() {
        if (this.isLoadList) {
            this.modal.close("ok");
        } else {
            this.modal.close();
        }

    }

}