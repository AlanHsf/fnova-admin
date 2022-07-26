import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CateProfileComponent } from './cate-profile.component';

describe('CateProfileComponent', () => {
  let component: CateProfileComponent;
  let fixture: ComponentFixture<CateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CateProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
