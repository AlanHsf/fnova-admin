import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpsuserComponent } from './opsuser.component';

describe('OpsuserComponent', () => {
  let component: OpsuserComponent;
  let fixture: ComponentFixture<OpsuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpsuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
