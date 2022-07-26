import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiyLessongroupComponent } from './diy-lessongroup.component';

describe('DiyLessongroupComponent', () => {
  let component: DiyLessongroupComponent;
  let fixture: ComponentFixture<DiyLessongroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiyLessongroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyLessongroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
