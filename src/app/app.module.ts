import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from '../../node_modules/ng2-validation';
import { NgbModule } from '../../node_modules/@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routing';

import { AdminComponent } from './admin/admin.component';
import { ManageMarketComponent } from './manage-market/manage-market.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';

import { ApiService } from './shared/services/api.service';
import { HttpService } from './shared/services/http.service';
import { AccountService } from './shared/services/account.service';
import { MarketService } from './shared/services/market.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { DialogComponent } from './shared/components/dialog.component';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    CustomFormsModule,
    routing,
    NgbModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    ManageMarketComponent,
    SettingsComponent,
    LoginComponent,
    DialogComponent
  ],
  providers: [
    ApiService,
    HttpService,
    AccountService,
    MarketService,
    AuthenticationService
  ],
  entryComponents: [DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
