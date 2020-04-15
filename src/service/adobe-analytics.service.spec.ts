import { TestBed } from '@angular/core/testing';

import { AdobeAnalyticsService } from './adobe-analytics.service';

describe('AdobeAnalyticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdobeAnalyticsService = TestBed.get(AdobeAnalyticsService);
    expect(service).toBeTruthy();
  });
});
