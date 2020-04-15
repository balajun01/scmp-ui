import { TestBed } from '@angular/core/testing';

import { AllocateCommoditiesService } from './allocate-commodities.service';

describe('AllocateCommoditiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllocateCommoditiesService = TestBed.get(AllocateCommoditiesService);
    expect(service).toBeTruthy();
  });
});
