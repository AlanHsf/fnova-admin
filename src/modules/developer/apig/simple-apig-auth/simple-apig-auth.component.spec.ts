import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleApigAuthComponent } from './simple-apig-auth.component';

describe('SimpleApigAuthComponent', () => {
  let component: SimpleApigAuthComponent;
  let fixture: ComponentFixture<SimpleApigAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleApigAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleApigAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
