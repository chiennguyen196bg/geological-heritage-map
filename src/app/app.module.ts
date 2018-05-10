import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgprimeModule } from './ngprime/ngprime.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomepageComponent } from './component/homepage/homepage.component';
import { HeritageService } from './service/heritage.service';
import { LeafletMapComponent } from './component/leaflet-map/leaflet-map.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LeafletMapComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgprimeModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    HeritageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
