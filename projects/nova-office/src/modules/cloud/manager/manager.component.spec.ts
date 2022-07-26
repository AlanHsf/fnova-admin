import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaFileManagerComponent } from './manager.component';

describe('NovaFileManagerComponent', () => {
  let component: NovaFileManagerComponent;
  let fixture: ComponentFixture<NovaFileManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NovaFileManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaFileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
