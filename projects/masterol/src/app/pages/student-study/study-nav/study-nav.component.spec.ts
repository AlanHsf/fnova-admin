import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyNavComponent } from './study-nav.component';

describe('NavbarComponent', () => {
  let component: StudyNavComponent;
  let fixture: ComponentFixture<StudyNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
