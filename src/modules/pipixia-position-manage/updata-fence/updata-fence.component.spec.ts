import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdataFenceComponent } from './updata-fence.component';

describe('UpdataFenceComponent', () => {
  let component: UpdataFenceComponent;
  let fixture: ComponentFixture<UpdataFenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdataFenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdataFenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
