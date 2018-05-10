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

}
