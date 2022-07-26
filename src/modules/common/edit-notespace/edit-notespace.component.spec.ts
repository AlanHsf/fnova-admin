import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNotespaceComponent } from './edit-notespace.component';

describe('EditNotespaceComponent', () => {
  let component: EditNotespaceComponent;
  let fixture: ComponentFixture<EditNotespaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditNotespaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNotespaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
