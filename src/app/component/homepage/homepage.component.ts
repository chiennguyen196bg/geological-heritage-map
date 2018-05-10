import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HeritageService } from '../../service/heritage.service';
import { Heritage } from '../../class/heritage';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  items: MenuItem[];
  results: any[];
  selectedResult: any;
  searchSidebarDisplay: any;
  resultSidebarDisplay: any;
  data: Heritage[] = [];
  title = 'hello world';
  selectedHeritage: Heritage;
  nClicked = 0;

  constructor(
    private heritageService: HeritageService
  ) { }

  ngOnInit() {
    this.title = 'Hkjhdjh';
    this.items = [
      { label: 'Di sản địa chất' },
    ];
    this.results = [
      {
        name: 'Test1',
        localName: 'Local name',
        district: 'string',
        commune: 'string',
        village: 'string',
        scale: 'string',
      },
      {
        name: 'Test2',
        localName: 'Local name',
        district: 'string',
        commune: 'string',
        village: 'string',
        scale: 'string',
      },
      {
        name: 'Test3',
        localName: 'Local name',
        district: 'string',
        commune: 'string',
        village: 'string',
        scale: 'string',
      }
    ];

    this.heritageService.getHeritages().subscribe(data => {
      this.data = data;
      // console.log(this.data);
    });
  }

  public onMarkerClicked(item: Heritage) {
    this.selectedHeritage = item;
    console.log('Catch event ' + item.sign);
    console.log(this.selectedHeritage);
    this.nClicked++;
  }

}
