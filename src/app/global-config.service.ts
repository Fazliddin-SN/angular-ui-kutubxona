import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalConfigService {
  readonly baseUrl = 'http://localhost:3007';
}
