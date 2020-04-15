import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductGroupEditFrameComponent } from './product-group-edit-frame.component';

describe('ProductGroupEditFrameComponent', () => {
  let component: ProductGroupEditFrameComponent;
  let fixture: ComponentFixture<ProductGroupEditFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductGroupEditFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupEditFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
