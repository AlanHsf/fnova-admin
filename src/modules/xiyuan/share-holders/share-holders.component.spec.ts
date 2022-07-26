import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareHoldersComponent } from './share-holders.component';

describe('ShareHoldersComponent', () => {
  let component: ShareHoldersComponent;
  let fixture: ComponentFixture<ShareHoldersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareHoldersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareHoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
