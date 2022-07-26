import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaCommonComponent } from './nova-common.component';

describe('NovaCommonComponent', () => {
  let component: NovaCommonComponent;
  let fixture: ComponentFixture<NovaCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NovaCommonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
