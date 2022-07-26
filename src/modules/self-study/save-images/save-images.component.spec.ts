import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveImagesComponent } from './save-images.component';

describe('SaveImagesComponent', () => {
  let component: SaveImagesComponent;
  let fixture: ComponentFixture<SaveImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveImagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
