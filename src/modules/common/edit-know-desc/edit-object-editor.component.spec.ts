import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditObjectEditorComponent } from './edit-object-editor.component';

describe('EditObjectEditorComponent', () => {
  let component: EditObjectEditorComponent;
  let fixture: ComponentFixture<EditObjectEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditObjectEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditObjectEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
