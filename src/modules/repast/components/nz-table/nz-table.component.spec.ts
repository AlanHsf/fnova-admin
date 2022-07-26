import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NzTableComponent } from './nz-table.component';

describe('NzTableComponent', () => {
  let component: NzTableComponent;
  let fixture: ComponentFixture<NzTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NzTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NzTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
