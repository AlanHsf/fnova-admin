import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngcardTplComponent } from './cardtpl.component';

describe('ExamcardTplComponent', () => {
  let component: EngcardTplComponent;
  let fixture: ComponentFixture<EngcardTplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngcardTplComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngcardTplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
