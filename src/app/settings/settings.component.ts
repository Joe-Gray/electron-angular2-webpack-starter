import { Component, OnInit } from '@angular/core';
import { remote } from 'electron';

@Component({
  selector: 'me-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('Hello Settings');
    console.log(process.versions.electron);
    let win = new remote.BrowserWindow({width: 300, height: 350});
    win.loadURL('https://www.google.com');
  }

}
