import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SiteService } from './services/site.service';
import { MapService } from './services/map.service';

import { AppComponent } from './app.component';
import { SiteListComponent } from './site-list/site-list.component';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';


const appRoutes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'sites', component: SiteListComponent },
	{ path: 'sites/:id', component: MapComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SiteListComponent,
    MapComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
	RouterModule.forRoot(appRoutes),
	NgbModule.forRoot()
  ],
  providers: [SiteService, MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
