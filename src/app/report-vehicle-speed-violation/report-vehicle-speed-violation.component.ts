import { Component, OnInit } from '@angular/core';
import { SharedService } from '../service/shared.service';
import { HttpClient } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-report-vehicle-speed-violation',
    templateUrl: './report-vehicle-speed-violation.component.html',
    styleUrls: ['./report-vehicle-speed-violation.component.css']
})
export class ReportVehicleSpeedViolationComponent implements OnInit {

    pageNumber = 0;
    textSearch = "";
    pageSize: number = 10;
    rowStart: number = 0;
    rowEnd: number = 0;
    totalNumberPage = 0;
    totalCountListAll = 0;
    arrayPage: any = [];
    dayFrom: Date = new Date;
    dayTo: Date = new Date;
    dataReport: any;
    formatDate = 'dd/MM/yyyy';
    timeFrom: Date = new Date;
    timeTo: Date = new Date;
    dropdownList: Array<{ privateCode: string }> = [];
    selectedItems: Array<{ pK_VehicleID: string }> = [];
    dropdownSettings: IDropdownSettings = {};
    listPaging = [
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

    constructor(private sharedService: SharedService, private http: HttpClient, private toastr: ToastrService,) { }

    ngOnInit() {
        this.dropdownList = [

        ];
        this.selectedItems = [

        ];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'pK_VehicleID',
            textField: 'privateCode',
            selectAllText: 'Chọn tất cả',
            unSelectAllText: 'Bỏ chọn tất cả',
            searchPlaceholderText: 'Tìm',
            noDataAvailablePlaceholderText: 'Không có dữ liệu',
            itemsShowLimit: 7,
            allowSearchFilter: true
        };
        this.getDataVehicles();
        this.setDefaultControl();
    }

    selectPage(i: number) {
        this.pageNumber = i;
        this.getDataReport();
    }

    nextPage() {
        if (this.pageNumber < (this.totalNumberPage - 1))
            this.pageNumber = this.pageNumber + 1;
        this.getDataReport();
    }

    prePage() {
        if (this.pageNumber > 0)
            this.pageNumber = this.pageNumber - 1;
        this.getDataReport();
    }

    maxPage() {
        this.pageNumber = this.totalNumberPage - 1;
        this.getDataReport();
    }

    minPage() {
        this.pageNumber = 0;
        this.getDataReport();
    }

    ChangeCbbPageSize() {
        this.pageNumber = 0;
        this.getDataReport();
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
            this.getDataReport();
        } else if (this.pageNumber >= this.arrayPage.length && this.arrayPage.length != 0) {
            this.pageNumber = this.arrayPage.length - 1;
            this.getDataReport();
        }

        if (this.totalCountListAll == 0) {
            this.rowStart = 0;
            this.rowEnd = 0;
        } else {
            this.rowStart = (this.pageSize * this.pageNumber) + 1;
            this.rowEnd = this.rowStart + this.dataReport.length - 1;
        }

    }

    prepareInput() {
        var data: any;
        var dayTo: any = "";
        if (this.dayTo) {
            var oldDate = this.dayTo;
            try {
                const offset = new Date(this.dayTo).getTimezoneOffset();
                dayTo = new Date(new Date(this.dayTo).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];

            } catch (error) {
                this.dayTo = oldDate;
            }
        } else {
            dayTo = null;
        }
        var dayFrom: any = "";
        if (this.dayFrom) {
            var oldDate = this.dayFrom;
            try {
                const offset = new Date(this.dayFrom).getTimezoneOffset();
                dayFrom = new Date(new Date(this.dayFrom).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];

            } catch (error) {
                this.dayFrom = oldDate
            }
        } else {
            dayFrom = null;
        }

        var timeFrom: string = "";
        if (this.timeFrom) {
            timeFrom = "T" + this.timeFrom.getHours().toString().padStart(2, "0") + ":" + this.timeFrom.getMinutes().toString().padStart(2, "0")
        }

        var timeTo: string = "";
        if (this.timeTo) {
            timeTo = "T" + this.timeTo.getHours().toString().padStart(2, "0") + ":" + this.timeTo.getMinutes().toString().padStart(2, "0")
        }

        data = {
            "userId": "1",
            "pageNumber": this.pageNumber + 1,

            "dayTo": this.dayTo == null ? null : dayTo + timeTo,

            "dayFrom": this.dayFrom == null ? null : dayFrom + timeFrom,
            "textSearch": this.selectedItems.map(function (item) {
                return item.pK_VehicleID;
            }).toString(),
            "pageSize": this.pageSize

        }
        return data
    }

    getDataReport() {
        if (this.checkValid()) {
            this.http.post<any>(this.sharedService.url + 'reportVehicleSpeedViolation/getDataReport',
                this.prepareInput(), this.sharedService.httpOptions)
                .subscribe(response => {
                    var list = response.data.iEnumerable;
                    var stt = this.pageNumber * this.pageSize;
                    for (let i = 0; i < list.length; i++) {
                        stt++;
                        list[i].stt = stt;
                    }
                    this.dataReport = list;
                    this.totalCountListAll = response.data.count;
                    this.changePageSize();
                });
        }
    }

    setDefaultTimeTo() {
        if (!this.timeTo) {
            this.timeTo = new Date();
        }
    }

    setDefaultTimeFrom() {
        if (!this.timeFrom) {
            this.timeFrom = new Date();
        }
    }

    setDefaultDayTo() {
        if (!this.dayTo) {
            this.dayTo = new Date();
        }
    }
    setDefaultDayFrom() {
        if (!this.dayFrom) {
            this.dayFrom = new Date();
        }
    }

    checkValid() {
        var valid = false;
        if (!this.dayFrom) {
            valid = false
            this.toastr.error("Từ ngày không được bỏ trống");
            return valid;
        }
        if (!this.dayTo) {
            valid = false
            this.toastr.error("Đến ngày không được bỏ trống");
            return valid;
        }
        if (this.dayFrom > this.dayTo) {
            valid = false
            this.toastr.error("Từ ngày không được lớn hơn đến ngày");
            return valid;
        }
        var diff = (this.dayTo.getTime() - this.dayFrom.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        if (diff > 60) {
            valid = false
            this.toastr.error("Vui lòng tìm kiếm báo cáo trong phạm vi 60 ngày!");
            return valid;
        }
        return true;
    }

    setDefaultControl() {
        this.dayFrom = new Date();
        this.dayTo = new Date();
        this.timeFrom = new Date();
        this.timeTo = new Date();
    }

    getDataVehicles() {
        this.http.get<any>(this.sharedService.url + 'reportVehicleSpeedViolation/getVehicles', this.sharedService.httpOptions)
            .subscribe(response => {
                this.dropdownList = response.data.iEnumerable;
            });
    }

}
