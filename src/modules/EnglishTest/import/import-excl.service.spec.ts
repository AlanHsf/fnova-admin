import { TestBed } from '@angular/core/testing';

import { ImportExclService } from './import-excl.service';

describe('ImportExclService', () => {
  let service: ImportExclService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportExclService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
