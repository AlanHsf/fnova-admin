import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ACompleteDataComponent } from './a-complete-data.component';

describe('ACompleteDataComponent', () => {
  let component: ACompleteDataComponent;
  let fixture: ComponentFixture<ACompleteDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ACompleteDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ACompleteDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
