import { TestBed } from '@angular/core/testing';

import { ApiRequestPreguntadosService } from './api-request-preguntados.service';

describe('ApiRequestPreguntadosService', () => {
  let service: ApiRequestPreguntadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRequestPreguntadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
