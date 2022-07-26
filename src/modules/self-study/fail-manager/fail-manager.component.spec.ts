import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailManagerComponent } from './fail-manager.component';

describe('FailManagerComponent', () => {
  let component: FailManagerComponent;
  let fixture: ComponentFixture<FailManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
