import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFenceComponent } from './edit-fence.component';

describe('EditFenceComponent', () => {
  let component: EditFenceComponent;
  let fixture: ComponentFixture<EditFenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditFenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
