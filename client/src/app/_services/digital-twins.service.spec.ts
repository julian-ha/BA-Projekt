import { TestBed } from '@angular/core/testing';

import { DigitalTwinsService } from './digital-twins.service';

describe('DigitalTwinsService', () => {
  let service: DigitalTwinsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalTwinsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
