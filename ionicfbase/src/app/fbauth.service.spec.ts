import { TestBed } from '@angular/core/testing';

import { FbauthService } from './fbauth.service';

describe('FbauthService', () => {
  let service: FbauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FbauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
