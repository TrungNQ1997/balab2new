/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Exercise2Component } from './exercise2.component';

describe('Exercise2Component', () => {
  let component: Exercise2Component;
  let fixture: ComponentFixture<Exercise2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Exercise2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Exercise2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
