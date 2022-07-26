import { TestBed } from '@angular/core/testing';

import { RichtextPreviewService } from './richtext-preview.service';

describe('RichtextPreviewService', () => {
  let service: RichtextPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RichtextPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
