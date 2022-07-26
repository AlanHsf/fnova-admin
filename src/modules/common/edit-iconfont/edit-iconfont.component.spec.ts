import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIconfontComponent } from './edit-iconfont.component';

describe('EditIconfontComponent', () => {
  let component: EditIconfontComponent;
  let fixture: ComponentFixture<EditIconfontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIconfontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditIconfontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
