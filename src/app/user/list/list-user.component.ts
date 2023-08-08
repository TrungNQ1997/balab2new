import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EditUserComponent } from '../edit/edit-user.component';
import { ModalComfirmComponent } from '../../common/modal-comfirm/modal-comfirm.component';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../service/shared.service';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-list-user',
    templateUrl: './list-user.component.html',
    styleUrls: ['./list-user.component.scss']
})
export class ListUserComponent {
    isUserIconVisible: boolean = false;
    pageSizeOptions: number[] = [];
    formatDate = 'dd/MM/yyyy';
    isShowDelete = false;
    isRoleShow = false;
    isRoleAdmin = false;
    isRoleAdd = false;
    isRoleEdit = false;
    isRoleDelete = false;
    isExpanded = false;
    birthdayFrom: Date | null = null;
    birthdayTo: Date | null = null;
    pageNumber = 1;
    textSearch = "";
    pageSize: number = 10;
    rowStart: number = 0;
    rowEnd: number = 0;
    totalNumberPage = 0;
    totalCountListAll = 0;
    arrayPage: any = [];
    modalOptions: NgbModalOptions = {
        windowClass: "myCustomModalClass",
        centered: true
    };
    gioiTinhSearch: number = 0;
    gioiTinhList: any = [];
    listPaging: any;
    users: any;

    constructor(private translateService: TranslateService,
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router, private toastr: ToastrService,
        private sharedService: SharedService, private modalService: NgbModal
    ) {
        this.translateService.setDefaultLang('vi');
        this.translateService.use('vi');
    }

    ngOnInit() {
        this.arrayPage = [];
        this.checkLoginAndRole();
        this.users = [];
        // this.birthdayFrom ;
        // this.birthdayTo = "";
        this.pageNumber = 0;
        this.textSearch = "";
        this.pageSize = 10;
        this.totalNumberPage = 0;
        this.totalCountListAll = 0;
        this.pageSizeOptions = [5, 10, 20];
        this.gioiTinhSearch = 0;
        this.getListUser();
        this.listPaging = [
            {
                value: 5
            },
            {
                value: 10
            },
            {
                value: 20
            }
        ];
        this.gioiTinhList = [
            { value: 0, viewValue: "Tất cả" },
            { value: 1, viewValue: "Nam" },
            { value: 2, viewValue: "Nữ" },
            { value: 3, viewValue: "Khác" }];

    }

    ngAfterViewInit() {

    }
    onPaginateChange($event: any) {
        this.pageNumber = $event.pageIndex;
        this.pageSize = $event.pageSize;
        this.getListUser();

    }
    exportTableToPDF() {
        const doc = new jsPDF();
        const table: any = document.getElementById('tableToExport');

        html2canvas(table).then((canvas: any) => {
            const imageData = canvas.toDataURL('image/png');
            const imgWidth = 210; // Width of A4 in mm (approximate)
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            doc.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);

            doc.save('table_data.pdf');
        });
    }

    printTable() {
        const doc = new jsPDF();
        const table: any = document.getElementById('tableToExport');

        html2canvas(table).then((canvas: any) => {
            const imageData = canvas.toDataURL('image/png');
            const imgWidth = 210; // Width of A4 in mm (approximate)
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            doc.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);

            doc.autoPrint();
            const printWindow = window.open('', '_blank');

            if (printWindow) {
                printWindow.document.open();
                printWindow.document.write('<html><head><title>In</title></head><body>' + doc.output('datauristring') + '</body></html>');
                printWindow.document.close();
            }


        });
    }

    exportToExcel(): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'data');
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url: string = window.URL.createObjectURL(data);
        const link: HTMLAnchorElement = document.createElement('a');
        link.href = url;
        link.download = fileName + '.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
    }

    deleteUser($event: any, a: any) {
        var notis = "Bạn có đồng ý xóa người dùng này không?"
        var modalRef = this.modalService.open(ModalComfirmComponent, this.modalOptions);

        modalRef.componentInstance.data = {
            id: 1,
            title: 'Xác nhận xóa',
            content: notis,
            contentBold: a.username
        };

        modalRef.result.then((result) => {

            if (result == "ok") {
                var list: any = new Object();
                list.array = [];
                list.array.push(a)

                this.callDeleteUser(list);
            }

        }).catch((error) => {

        });

    }

    selectAll() {
        this.users.forEach(function (item: any) {
            item.selected = !item.selected;
        })
        this.changCheckBox();
    }

    callDeleteUser(users: any) {
        var data: any;
        data = new Object();
        data.users = [];
        data.userId = "2";
        users.array.forEach((element: { id: any; username: any; }) => {
            data.users.push({
                id: element.id,
                username: element.username
            });
        });

        this.http.post<any>(this.sharedService.url + 'user/deleteUser',
            data, this.sharedService.httpOptions)
            .subscribe(response => {
                if (!response.data.list.includes(0)) {
                    this.toastr.error("Xóa thất bại", "Thông báo")

                } else {
                    this.toastr.success("Xóa thành công", "Thông báo")
                    this.getListUser();
                }
            });

    }

    deleteList() {
        var listDelete = this.users.filter((m: { selected: boolean; }) => m.selected == true);
        if (listDelete.length == 0) {
            this.toastr.error("Chọn người dùng cần xóa!")
        } else {

            var notis = "Bạn có đồng ý xóa những người dùng này không? ";
            var listUser = "";
            listDelete.forEach(function (elem: any, idx: any, listDelete: any) {
                if (idx == (listDelete.length - 1)) {
                    listUser = listUser + " " + elem.username + " ";
                } else {
                    listUser = listUser + " " + elem.username + ",";
                }

            })

            var modalRef = this.modalService.open(ModalComfirmComponent, this.modalOptions);

            modalRef.componentInstance.data = {
                id: 1,
                title: 'Xác nhận xóa',
                content: notis,
                contentBold: listUser
            };

            modalRef.result.then((result) => {

                if (result == "ok") {
                    this.callDeleteList();
                }

            }).catch((error) => {
                console.log(error)
            });

        }
    }

    callDeleteList() {
        var data: any;
        data = new Object();
        data.users = this.users.filter((m: { selected: boolean; }) => m.selected == true);
        data.userId = "2";
        this.http.post<any>(this.sharedService.url + 'user/deleteUser',
            data, this.sharedService.httpOptions)
            .subscribe(response => {
                if (!response.data.list.includes(0)) {
                    this.toastr.error("Xóa thất bại", "Thông báo");

                } else {
                    this.toastr.success("Xóa thành công", "Thông báo");

                }
                this.getListUser();
            });
    }

    search() {
        this.pageNumber = 0;
        this.getListUser();
    }

    validInputSearch() {
        if (this.birthdayFrom && this.birthdayTo) {
            if (this.birthdayFrom > this.birthdayTo) {

                this.toastr.error("Từ ngày không được lớn hơn đến ngày");
                return false;
            }
        }
        return true;
    }

    getListUser() {
        if (this.validInputSearch()) {
            var data: any;

            var dayTo: any = "";
            if (this.birthdayTo) {
                try {
                    const offset = new Date(this.birthdayTo).getTimezoneOffset();
                    dayTo = new Date(new Date(this.birthdayTo).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];

                } catch (error) {
                }
            } else {
                dayTo = null;
            }
            var dayFrom: any = "";
            if (this.birthdayFrom) {
                try {
                    const offset = new Date(this.birthdayFrom).getTimezoneOffset();
                    dayFrom = new Date(new Date(this.birthdayFrom).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];

                } catch (error) {
                }
            } else {
                dayFrom = null;
            }

            data = {
                "userId": "1",
                "pageNumber": this.pageNumber + 1,
                "gioiTinhSearch": this.gioiTinhSearch,
                "DayTo": this.birthdayTo ? dayTo : null,
                "DayFrom": this.birthdayFrom ? dayFrom : null,
                "textSearch": this.textSearch,
                "pageSize": this.pageSize

            }

            this.http.post<any>(this.sharedService.url + 'user/getListUserFilter',
                data, this.sharedService.httpOptions)
                .subscribe(response => {

                    this.users = response.data.list;
                    this.totalCountListAll = response.data.count;
                    this.changCheckBox();
                    this.changePageSize();
                });
        }
    }

    changePageSize() {
        this.totalNumberPage = Math.ceil(this.totalCountListAll / this.pageSize);
        this.arrayPage = [];
        for (var i = 0; i < this.totalNumberPage; i++) {
            this.arrayPage.push({
                value: i,
                text: (i + 1)
            });
        }

        if (this.pageNumber < 0) {
            this.pageNumber = 0;
            //this.getListUser();
        } else if (this.pageNumber >= this.arrayPage.length) {
            this.pageNumber = this.arrayPage.length - 1;
            //this.getListUser();
        }

        if (this.totalCountListAll == 0) {
            this.rowStart = 0;
            this.rowEnd = 0;
        } else {
            this.rowStart = (this.pageSize * this.pageNumber) + 1;
            this.rowEnd = this.rowStart + this.users.length - 1;
        }

    }

    changCheckBox() {
        if (this.users.filter((m: { selected: boolean; }) => m.selected == true).length > 0) {
            this.isShowDelete = true;
        } else {
            this.isShowDelete = false;
        }
    }

    selectPage(i: number) {
        this.pageNumber = i;
        this.getListUser();
    }

    nextPage() {
        if (this.pageNumber < (this.totalNumberPage - 1))
            this.pageNumber = this.pageNumber + 1;
        this.getListUser();
    }

    prePage() {
        if (this.pageNumber > 0)
            this.pageNumber = this.pageNumber - 1;
        this.getListUser();
    }

    maxPage() {
        this.pageNumber = this.totalNumberPage - 1;
        this.getListUser();
    }

    minPage() {
        this.pageNumber = 0;
        this.getListUser();
    }

    ChangeCbbPageSize() {
        this.pageNumber = 0;
        this.getListUser();
    }

    checkLoginAndRole() {
        var session = sessionStorage.getItem("login");
        if (session == "true") {
            this.sharedService.callGetRole("").subscribe(result => {
                this.isRoleAdmin = result.data.admin
                if (this.isRoleAdmin) {
                    this.isRoleShow = true;
                    this.isRoleAdd = true;
                    this.isRoleEdit = true;
                    this.isRoleDelete = true;
                } else {
                    if (result.data.list) {
                        var roleShow = result.data.list.filter((m: { action: string; }) => m.action == "show");
                        var roleAdd = result.data.list.filter((m: { action: string; }) => m.action == "add");
                        var roleEdit = result.data.list.filter((m: { action: string; }) => m.action == "edit");
                        var roleDelete = result.data.list.filter((m: { action: string; }) => m.action == "delete");
                        if (roleShow.length > 0) {
                            this.isRoleShow = true;
                        }
                        if (roleAdd.length > 0) {
                            this.isRoleAdd = true;
                        }
                        if (roleEdit.length > 0) {
                            this.isRoleEdit = true;
                        }
                        if (roleDelete.length > 0) {
                            this.isRoleDelete = true;
                        }

                        if (!this.isRoleShow) {
                            this.router.navigate([''], { relativeTo: this.route });
                        }

                    }

                    else {
                        this.router.navigate([''], { relativeTo: this.route });
                    }

                }

            })
        } else {

            var token = this.sharedService.getCookie("token");
            if (token) {
                this.sharedService.callCheckLoginAndGetRole(token).subscribe(result => {
                    if (!result.data.error) {

                        this.isRoleAdmin = result.data.admin
                        if (this.isRoleAdmin) {
                            this.isRoleShow = true;
                            this.isRoleAdd = true;
                            this.isRoleEdit = true;
                            this.isRoleDelete = true;
                        } else {

                            if (result.data.list) {
                                var roleShow = result.data.list.filter((m: { action: string; }) => m.action == "show");
                                var roleAdd = result.data.list.filter((m: { action: string; }) => m.action == "add");
                                var roleEdit = result.data.list.filter((m: { action: string; }) => m.action == "edit");
                                var roleDelete = result.data.list.filter((m: { action: string; }) => m.action == "delete");
                                if (roleShow.length > 0) {
                                    this.isRoleShow = true;
                                }
                                if (roleAdd.length > 0) {
                                    this.isRoleAdd = true;
                                }
                                if (roleEdit.length > 0) {
                                    this.isRoleEdit = true;
                                }
                                if (roleDelete.length > 0) {
                                    this.isRoleDelete = true;
                                }

                                if (!this.isRoleShow) {
                                    this.router.navigate([''], { relativeTo: this.route });
                                }

                            }

                            else {
                                this.router.navigate([''], { relativeTo: this.route });
                            }

                        }

                    } else {
                        this.router.navigate([''], { relativeTo: this.route });
                    }
                });

            } else {
                this.router.navigate([''], { relativeTo: this.route });
            }

        }

    }

    add() {
        var modalRef = this.modalService.open(EditUserComponent, this.modalOptions);

        modalRef.componentInstance.data = {
            id: 1,
            title: 'Thêm người dùng',
            statusForm: 'add'
        };

        modalRef.result.then((result) => {

            if (result == "ok") {
                this.getListUser();
            }

        }).catch((error) => {
            console.log(error)
        });

    }

    editUser(event: any, user: any) {
        var modalRef = this.modalService.open(EditUserComponent, this.modalOptions);

        modalRef.componentInstance.data = {
            data: Object.assign({}, user),
            title: 'Sửa người dùng',
            statusForm: 'edit'
        };

        modalRef.result.then((result) => {

            if (result == "ok") {
                this.getListUser();
            }

        }).catch((error) => {
            console.log(error)
        });

    }

}
