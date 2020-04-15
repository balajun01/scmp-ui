import { TestBed } from '@angular/core/testing';

import { SetTargetService } from './set-target.service';

describe('SetTargetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetTargetService = TestBed.get(SetTargetService);
    expect(service).toBeTruthy();
  });
});
