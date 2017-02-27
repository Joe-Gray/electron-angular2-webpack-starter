import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
  title = 'Market Expansion';
  nodeVersion = process.versions.node;
  chromeVersion = process.versions.chrome;
  electronVersion = process.versions.electron;
}
