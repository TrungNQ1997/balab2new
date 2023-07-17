import { Component, OnInit } from '@angular/core';
import { SharedService } from '../service/shared.service';
import { HttpClient } from '@angular/common/http';
import {  IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-report-vehicle-speed-violation',
  templateUrl: './report-vehicle-speed-violation.component.html',
  styleUrls: ['./report-vehicle-speed-violation.component.css']
})
export class ReportVehicleSpeedViolationComponent implements OnInit {

  pageNumber = 1;
    textSearch = "";
    pageSize: number = 10;
    rowStart: number = 0;
    rowEnd: number = 0;
    totalNumberPage = 0;
    totalCountListAll = 0;
    arrayPage: any = [];
    dayFrom = "";
    dayTo = "";
    dataReport:any;
    formatDate = 'dd/MM/yyyy';
    timeFrom = { hour: 13, minute: 30 };
    timeTo = { hour: 13, minute: 30 };
    dropdownList:Array<{  privateCode: string}> = [];
  selectedItems:Array<{  privateCode: string}> = [];
  dropdownSettings:IDropdownSettings = {};
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
  selectedState: string="";
   states: string[] = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado']

  constructor(private sharedService: SharedService,private http: HttpClient,) { }

  ngOnInit() {
    this.dropdownList = [
     
    ];
    this.selectedItems = [
    
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'privateCode',
      textField: 'privateCode',
      selectAllText: 'Chọn tất cả',
      unSelectAllText: 'Bỏ chọn tất cả',
      searchPlaceholderText:'Tìm',
      itemsShowLimit: 7,
      allowSearchFilter: true
    };
    this.getDataVehicles();
  }

  onItemSelect(item: any) {
    console.log(this.selectedItems);
  }
  onSelectAll(items: any) {
    console.log(this.selectedItems);
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
  } else if (this.pageNumber >= this.arrayPage.length) {
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

getDataReport() {

  var data: any;

  var dayTo: any = "";
  if (this.dayTo) {
      try {
          const offset = new Date(this.dayTo).getTimezoneOffset();
          dayTo = new Date(new Date(this.dayTo).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];

      } catch (error) {
          this.dayTo = "";
      }
  } else {
      dayTo = null;
  }
  var dayFrom: any = "";
  if (this.dayFrom) {
      try {
          const offset = new Date(this.dayFrom).getTimezoneOffset();
          dayFrom = new Date(new Date(this.dayFrom).getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];

      } catch (error) {
          this.dayFrom = ""
      }
  } else {
      dayFrom = null;
  }

  data = {
      "userId": "1",
      "pageNumber": this.pageNumber + 1,
      // "gioiTinhSearch": this.gioiTinhSearch,
      "dayTo": this.dayTo == "" ? null : dayTo,
      "dayFrom": this.dayFrom == "" ? null : dayFrom,
      "textSearch": this.textSearch,
      "pageSize": this.pageSize

  }

  this.http.post<any>(this.sharedService.url + 'user/getListUserFilter',
      data, this.sharedService.httpOptions)
      .subscribe(response => {

          this.dataReport = response.data.list; 
          this.totalCountListAll = response.data.count;
          
          this.changePageSize(); 
      });

}


getDataVehicles() {

  
  var data = {
       

  }

  this.http.get<any>(this.sharedService.url + 'user/getVehicles', this.sharedService.httpOptions)
      .subscribe(response => {

          this.dropdownList = response.data.list; 
          // this.totalCountListAll = response.data.count;
          
          // this.changePageSize(); 
      });

}

}
