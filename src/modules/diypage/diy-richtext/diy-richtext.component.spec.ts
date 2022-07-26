import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiyRichtextComponent } from './diy-richtext.component';

describe('DiyRichtextComponent', () => {
  let component: DiyRichtextComponent;
  let fixture: ComponentFixture<DiyRichtextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiyRichtextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyRichtextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
