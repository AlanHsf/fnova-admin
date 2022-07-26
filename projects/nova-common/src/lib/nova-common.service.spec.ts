import { TestBed } from '@angular/core/testing';

import { NovaCommonService } from './nova-common.service';

describe('NovaCommonService', () => {
  let service: NovaCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NovaCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
