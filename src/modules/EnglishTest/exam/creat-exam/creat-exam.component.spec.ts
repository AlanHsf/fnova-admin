import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatExamComponent } from './creat-exam.component';

describe('CreatExamComponent', () => {
  let component: CreatExamComponent;
  let fixture: ComponentFixture<CreatExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatExamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
