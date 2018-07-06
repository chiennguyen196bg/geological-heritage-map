import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HeritageService } from '../../service/heritage.service';
import { Heritage } from '../../class/heritage';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { ExcelService } from '../../service/excel.service';


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
    { label: 'Di sản địa chất' }
  ];
  searchSidebarDisplay: any;
  resultSidebarDisplay: any;
  data: Heritage[] = [];
  selectedHeritage: Heritage;
  searchResults: Heritage[];

  constructor(
    private heritageService: HeritageService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
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

  public onSeeMore() {
    console.log(this.selectedHeritage.attachedFile);
    window.open(this.selectedHeritage.attachedFile, '_blank');
  }

  public onDrawed(heritages: Heritage[]) {
    this.searchResults = heritages;
    this.resultSidebarDisplay = true;
  }

  public exportExcel() {
    this.excelService.exportAsExcelFile(this.searchResults, 'result');
  }

  public printDirectly() {
    this.excelService.printDirectly(this.searchResults);
  }

}
