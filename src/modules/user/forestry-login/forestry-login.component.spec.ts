import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForestryLoginComponent } from './forestry-login.component';

describe('ForestryLoginComponent', () => {
  let component: ForestryLoginComponent;
  let fixture: ComponentFixture<ForestryLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForestryLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForestryLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
