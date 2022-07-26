import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductProfitComponent } from './product-profit.component';

describe('ProductProfitComponent', () => {
  let component: ProductProfitComponent;
  let fixture: ComponentFixture<ProductProfitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductProfitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
