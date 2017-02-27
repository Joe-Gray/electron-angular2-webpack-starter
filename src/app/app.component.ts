import { Component } from '@angular/core';

import { ApiService } from './shared';

import '../style/app.scss';

@Component({
  selector: 'me-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  url = 'https://github.com/preboot/angular2-webpack';
  title: string;
  nodeVersion: string;
  chromeVersion: string;
  electronVersion: string;

  constructor(private api: ApiService) {
    this.title = this.api.title;
    this.nodeVersion = this .api.nodeVersion;
    this.chromeVersion = this.api.chromeVersion;
    this.electronVersion = this.api.electronVersion;
  }
}
