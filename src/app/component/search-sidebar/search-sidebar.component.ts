import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HeritageService } from '../../service/heritage.service';
import { Heritage } from '../../class/heritage';

@Component({
  selector: 'app-search-sidebar',
  templateUrl: './search-sidebar.component.html',
  styleUrls: ['./search-sidebar.component.css']
})
export class SearchSidebarComponent implements OnInit {
  name = '';
  districtName = '';
  communeName = '';
  nameResults: string[];
  districtNameResults: string[];
  communeNameResults: string[];
  @Output() searched = new EventEmitter<Heritage[]>();

  constructor(
    private heritageService: HeritageService
  ) { }

  ngOnInit() {
  }

  search() {
    console.log('search: name = ' + this.name + ', districtName = ' + this.districtName + ', communeName = ' + this.communeName);
    this.heritageService.searchHeritages(this.name, this.districtName, this.communeName)
      .subscribe(data => {
        this.searched.emit(data);
      });
  }

  suggestName(event) {
    this.heritageService.suggest(event.query, 'name').subscribe(data => this.nameResults = data);
  }
  suggestDistrictName(event) {
    this.heritageService.suggest(event.query, 'district').subscribe(data => this.districtNameResults = data);
  }
  suggestCommuneName(event) {
    this.heritageService.suggest(event.query, 'commune').subscribe(data => this.communeNameResults = data);
  }

}
