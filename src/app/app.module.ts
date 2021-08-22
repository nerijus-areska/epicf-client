import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserStatusComponent } from './user-status/user-status.component';
import { ItemsComponent } from './items/items.component';
import { UserService } from './service/user.service';
import { HttpClientModule } from '@angular/common/http';
import { MissionComponent } from './mission/mission.component';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';

const appRoutes: Routes = [
  { path: 'quest', component: MissionComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'shop', component: ShopComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    UserStatusComponent,
    ItemsComponent,
    MissionComponent,
    ShopComponent,
  ],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(appRoutes)],
  providers: [UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
