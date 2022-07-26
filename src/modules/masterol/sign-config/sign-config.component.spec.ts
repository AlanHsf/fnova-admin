import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignConfigComponent } from './sign-config.component';

describe('SignConfigComponent', () => {
  let component: SignConfigComponent;
  let fixture: ComponentFixture<SignConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
