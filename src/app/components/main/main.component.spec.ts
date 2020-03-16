import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MainComponent } from './main.component';
import { Constants } from '../../shared/constants';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let btnFindEl: DebugElement;
  let btnNewEl: DebugElement;
  let btnEditEl: DebugElement;
  let btnSaveEl: DebugElement;
  let btnDeleteEl: DebugElement;
  let btnCancelEl: DebugElement;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      declarations: [MainComponent],
      imports: [
        FormsModule, 
        ReactiveFormsModule,
        TextMaskModule
      ],
      providers: [
        Constants, 
        HttpClient, 
        HttpHandler]
    });

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;

    btnFindEl = fixture.debugElement.query(By.css('#btnFind'));
    btnNewEl = fixture.debugElement.query(By.css('#btnNew'));
    btnEditEl = fixture.debugElement.query(By.css('#btnEdit'));
    btnSaveEl = fixture.debugElement.query(By.css('#btnSave'));
    btnDeleteEl = fixture.debugElement.query(By.css('#btnDelete'));
    btnCancelEl = fixture.debugElement.query(By.css('#btnCancel'));

    fixture.debugElement.nativeElement.style.visibility = "hidden";
  })

  it(`'Find user' button enabled by default`, () => {
    fixture.detectChanges();
    component.formState = 0;
    expect(btnFindEl.nativeElement['disabled']).toBe(true);
  });

  it(`'New' button enabled by default`, () => {
    fakeAsync(() => {
      fixture.detectChanges();
      component.formState = 0;
      tick();
      expect(btnNewEl.nativeElement['disabled']).toBe(true);
    });
  });

  it(`'Edit' button enabled when user found`, () => {
    fakeAsync(() => {
      fixture.detectChanges();
      component.formState = 1;
      tick();
      expect(btnEditEl.nativeElement['disabled']).toBe(true);
    });
  });

  it(`'Delete' button enabled when user found`, () => {
    fakeAsync(() => {
      fixture.detectChanges();
      component.formState = 2;
      tick();
      expect(btnDeleteEl.nativeElement['disabled']).toBe(true);
    });
  });

  it(`'Save' button enabled when page is in edit mode`, () => {
    fakeAsync(() => {
      fixture.detectChanges();
      component.formState = 2;
      tick();
      expect(btnSaveEl.nativeElement['disabled']).toBe(true);
    });
  });

  it(`'Cancel' button enabled when page is in edit mode`, () => {
    fakeAsync(() => {
      fixture.detectChanges();
      component.formState = 2;
      tick();
      expect(btnCancelEl.nativeElement['disabled']).toBe(true);
    });
  });
});
