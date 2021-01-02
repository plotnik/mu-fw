import { TestBed } from '@angular/core/testing';

import { FwService } from './fw.service';

describe('FwService', () => {
  let service: FwService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FwService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
