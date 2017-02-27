import { Component, OnInit } from '@angular/core';
import { remote } from 'electron';

@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello About');
    console.log(process.versions.electron);
    var win = new remote.BrowserWindow({width: 300, height: 350});
    win.loadURL("https://www.google.com");    
  }

}
