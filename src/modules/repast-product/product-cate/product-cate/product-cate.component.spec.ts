import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCateComponent } from './product-cate.component';

describe('ProductCateComponent', () => {
  let component: ProductCateComponent;
  let fixture: ComponentFixture<ProductCateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
