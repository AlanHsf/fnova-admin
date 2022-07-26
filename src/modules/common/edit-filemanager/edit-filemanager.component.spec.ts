import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFileManagerComponent } from './edit-filemanager.component';

describe('EditFileManagerComponent', () => {
  let component: EditFileManagerComponent;
  let fixture: ComponentFixture<EditFileManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFileManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
