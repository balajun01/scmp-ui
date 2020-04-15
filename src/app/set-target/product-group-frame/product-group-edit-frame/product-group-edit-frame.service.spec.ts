import { TestBed } from '@angular/core/testing';

import { ProductGroupEditFrameService } from './product-group-edit-frame.service';

describe('ProductGroupEditFrameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductGroupEditFrameService = TestBed.get(ProductGroupEditFrameService);
    expect(service).toBeTruthy();
  });
});
