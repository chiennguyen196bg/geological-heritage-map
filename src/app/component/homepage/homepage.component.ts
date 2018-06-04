import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HeritageService } from '../../service/heritage.service';
import { Heritage } from '../../class/heritage';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  @ViewChild(LeafletMapComponent)
  private leafletMapComponent: LeafletMapComponent;

  items: MenuItem[];
  searchSidebarDisplay: any;
  resultSidebarDisplay: any;
  data: Heritage[] = [];
  title = 'hello world';
  selectedHeritage: Heritage;
  searchResults: Heritage[];

  constructor(
    private heritageService: HeritageService
  ) { }

  ngOnInit() {
    this.title = 'Hkjhdjh';
    this.items = [
      { label: 'Di sản địa chất' },
    ];

    this.heritageService.getHeritages().subscribe(data => {
      this.data = data;
      // console.log(this.data);
    });
  }

  public onMarkerClicked(item: Heritage) {
    this.selectedHeritage = item;
    console.log('Catch event ' + item.id);
    console.log(this.selectedHeritage);
  }

  public onSearched(data: Heritage[]) {
    // console.log(data);
    this.searchResults = data;
  }

  public onResultSelected(e) {
    // console.log(e.data);
    this.leafletMapComponent.flyToHeritage(e.data);
    this.selectedHeritage = e.data;
  }

  public onSearchResultSidebarHide(e) {
    console.log('On hide search results sidebar hide');
    this.searchResults = [];
  }

}
