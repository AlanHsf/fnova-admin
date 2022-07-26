import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileMatchComponent } from './edit-profile-match.component';

describe('EditProfileMatchComponent', () => {
  let component: EditProfileMatchComponent;
  let fixture: ComponentFixture<EditProfileMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProfileMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
