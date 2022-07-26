import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyfunctionComponent } from './myfunction.component';

describe('MyfunctionComponent', () => {
  let component: MyfunctionComponent;
  let fixture: ComponentFixture<MyfunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyfunctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyfunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
