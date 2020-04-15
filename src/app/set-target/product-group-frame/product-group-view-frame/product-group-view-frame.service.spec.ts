import { TestBed } from '@angular/core/testing';

import { ProductGroupViewFrameService } from './product-group-view-frame.service';

describe('ProductGroupViewFrameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductGroupViewFrameService = TestBed.get(ProductGroupViewFrameService);
    expect(service).toBeTruthy();
  });
});
