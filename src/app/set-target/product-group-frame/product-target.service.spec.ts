import { TestBed } from '@angular/core/testing';

import { ProductTargetService } from './product-target.service';

describe('ProductTargetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductTargetService = TestBed.get(ProductTargetService);
    expect(service).toBeTruthy();
  });
});
