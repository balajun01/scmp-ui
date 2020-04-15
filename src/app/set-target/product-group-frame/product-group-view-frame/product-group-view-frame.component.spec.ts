import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupViewFrameComponent } from './product-group-view-frame.component';

describe('ProductGroupViewFrameComponent', () => {
  let component: ProductGroupViewFrameComponent;
  let fixture: ComponentFixture<ProductGroupViewFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGroupViewFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupViewFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
