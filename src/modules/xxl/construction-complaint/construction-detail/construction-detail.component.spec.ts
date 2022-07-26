import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionDetailComponent } from './construction-detail.component';

describe('ConstructionDetailComponent', () => {
  let component: ConstructionDetailComponent;
  let fixture: ComponentFixture<ConstructionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstructionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
