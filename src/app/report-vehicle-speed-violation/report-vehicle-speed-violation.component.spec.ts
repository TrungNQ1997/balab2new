/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReportVehicleSpeedViolationComponent } from './report-vehicle-speed-violation.component';

describe('ReportVehicleSpeedViolationComponent', () => {
  let component: ReportVehicleSpeedViolationComponent;
  let fixture: ComponentFixture<ReportVehicleSpeedViolationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVehicleSpeedViolationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVehicleSpeedViolationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
