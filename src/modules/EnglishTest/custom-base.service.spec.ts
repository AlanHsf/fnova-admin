import { TestBed } from '@angular/core/testing';

import { CustomBaseService } from './custom-base.service';

describe('CustomBaseService', () => {
  let service: CustomBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
