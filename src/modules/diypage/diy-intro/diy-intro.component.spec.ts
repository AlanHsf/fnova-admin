import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiyIntroComponent } from './diy-intro.component';

describe('DiyIntroComponent', () => {
  let component: DiyIntroComponent;
  let fixture: ComponentFixture<DiyIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiyIntroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
