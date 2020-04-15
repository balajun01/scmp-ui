import { TestBed } from '@angular/core/testing';

import { AllocateCommodityViewFrameService } from './allocate-commodity-view-frame.service';

describe('AllocateCommodityViewFrameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllocateCommodityViewFrameService = TestBed.get(AllocateCommodityViewFrameService);
    expect(service).toBeTruthy();
  });
});
