import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesizeComponent } from './synthesize.component';

describe('SynthesizeComponent', () => {
  let component: SynthesizeComponent;
  let fixture: ComponentFixture<SynthesizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynthesizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynthesizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
