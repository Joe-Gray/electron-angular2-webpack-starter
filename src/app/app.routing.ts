import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ManageMarketComponent } from './manage-market/manage-market.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'manage-market', component: ManageMarketComponent},
  { path: 'settings', component: SettingsComponent},
  { path: 'login', component: LoginComponent}
];

export const routing = RouterModule.forRoot(routes);
