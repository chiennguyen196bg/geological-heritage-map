import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgprimeModule } from './ngprime/ngprime.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

import { AppComponent } from './app.component';
import { HomepageComponent } from './component/homepage/homepage.component';
import { HeritageService } from './service/heritage.service';
import { LeafletMapComponent } from './component/leaflet-map/leaflet-map.component';
import { SearchSidebarComponent } from './component/search-sidebar/search-sidebar.component';
import { ExcelService } from './service/excel.service';
import { SearchResultComponent } from './component/search-result/search-result.component';
import { HeritageOverviewComponent } from './component/heritage-overview/heritage-overview.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    LeafletMapComponent,
    SearchSidebarComponent,
    SearchResultComponent,
    HeritageOverviewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgprimeModule,
    BrowserAnimationsModule,
    LeafletModule.forRoot(),
    HttpClientModule,
    LeafletMarkerClusterModule,
    LeafletDrawModule.forRoot()
  ],
  providers: [
    HeritageService,
    ExcelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
