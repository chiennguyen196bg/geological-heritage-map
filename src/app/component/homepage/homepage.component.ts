import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HeritageService } from '../../service/heritage.service';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { ExcelService } from '../../service/excel.service';
import { Heritage } from '../../models/heritage';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomepageComponent implements OnInit {
  @ViewChild(LeafletMapComponent)
  private leafletMapComponent: LeafletMapComponent;

  items: MenuItem[] = [
    { label: 'CSDL Di sản tỉnh DakNong' }
  ];
  searchSidebarDisplay: any;
  resultSidebarDisplay: any;
  selectedHeritage: Heritage;
  searchResults: Heritage[];

  constructor(
    private heritageService: HeritageService
  ) { }

  ngOnInit() {
  }

  public onMarkerClicked(item: Heritage) {
    this.selectedHeritage = item;
    console.log('Catch event ' + item.TT);
    console.log(this.selectedHeritage);
  }

  public onSearched(data: Heritage[]) {
    // console.log(data);
    this.searchResults = data;
    this.leafletMapComponent.flyToHeritages(data);
  }

  public onResultSelected(heritage: Heritage) {
    // console.log(e.data);
    this.leafletMapComponent.flyToHeritage(heritage);
    this.selectedHeritage = heritage;
  }

  public onSearchResultSidebarHide(e) {
    console.log('On hide search results sidebar hide');
    this.searchResults = [];
  }

  public onDrawed(heritages: Heritage[]) {
    this.resultSidebarDisplay = true;
    this.searchResults = heritages;
  }


}
