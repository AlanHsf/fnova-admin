import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaqlComponent } from './novaql.component';

describe('NovaqlComponent', () => {
  let component: NovaqlComponent;
  let fixture: ComponentFixture<NovaqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovaqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
