import { TestBed } from '@angular/core/testing';

import { DiypageService } from './diypage.service';

describe('DiypageService', () => {
  let service: DiypageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiypageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
