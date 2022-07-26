import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectListComponent } from './correct-list.component';

describe('CorrectListComponent', () => {
  let component: CorrectListComponent;
  let fixture: ComponentFixture<CorrectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
