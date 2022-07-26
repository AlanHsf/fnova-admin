import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitySettingComponent } from './activity-setting.component';

describe('ActivitySettingComponent', () => {
  let component: ActivitySettingComponent;
  let fixture: ComponentFixture<ActivitySettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitySettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
