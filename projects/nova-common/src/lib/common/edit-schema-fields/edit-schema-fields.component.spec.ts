import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSchemaFieldsComponent } from './edit-schema-fields.component';

describe('EditSchemaFieldsComponent', () => {
  let component: EditSchemaFieldsComponent;
  let fixture: ComponentFixture<EditSchemaFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSchemaFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSchemaFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
