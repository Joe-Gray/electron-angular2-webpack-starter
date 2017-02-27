import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';
import { ManageMarketComponent } from './manage-market/manage-market.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'manage-market', component: ManageMarketComponent},
  { path: 'settings', component: SettingsComponent}
];

export const routing = RouterModule.forRoot(routes);
