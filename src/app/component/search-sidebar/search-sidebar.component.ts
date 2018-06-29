import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HeritageService, SearchObject } from '../../service/heritage.service';
import { Heritage } from '../../class/heritage';
import { Observable } from 'rxjs/Observable';
import { SelectItem } from 'primeng/api';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-search-sidebar',
  templateUrl: './search-sidebar.component.html',
  styleUrls: ['./search-sidebar.component.css']
})
export class SearchSidebarComponent implements OnInit {
  name = '';
  selectedDistricts = [];
  selectedCommunes = [];
  nameSuggestion: string[];
  types = [
    { label: 'A_Cổ sinh', value: 'A' },
    { label: 'B_Địa mạo', value: 'B' },
    { label: 'C_Cổ môi trường', value: 'C' },
    { label: 'D_Đá', value: 'D' },
    { label: 'E_Địa tầng', value: 'E' },
    { label: 'F_Khoáng vật, khoáng sản', value: 'F' },
  ];
  selectedTypes = [];
  @Output() searched = new EventEmitter<Heritage[]>();

  constructor(
    private heritageService: HeritageService
  ) { }

  ngOnInit() {
  }

  search() {
    const searchObjects: SearchObject[] = [];
    if (this.name !== '') {
      searchObjects.push({ field: 'name', value: this.name, type: 'single' });
    }
    if (this.selectedDistricts.length > 0) {
      searchObjects.push({ field: 'district', value: this.selectedDistricts, type: 'or' });
    }
    if (this.selectedCommunes.length > 0) {
      searchObjects.push({ field: 'commune', value: this.selectedCommunes, type: 'or' });
    }
    if (this.selectedTypes.length > 0) {
      searchObjects.push({ field: 'label', value: this.selectedTypes, type: 'and' });
    }
    this.heritageService.search(...searchObjects).subscribe(data => {
      this.searched.emit(data);
    });
  }

  suggestName(event) {
    this.heritageService.suggest(event.query, 'name').subscribe(data => this.nameSuggestion = data);
  }
  // suggestDistrictName(event) {
  //   this.heritageService.suggest(event.query, 'district').subscribe(data => this.districtNameResults = data);
  // }
  // suggestCommuneName(event) {
  //   this.heritageService.suggest(event.query, 'commune').subscribe(data => this.communeNameResults = data);
  // }

  getDistinstValues(fieldName: string): Observable<SelectItem[]> {
    return this.heritageService.getDistinstValues(fieldName).pipe(
      map(data => data.map(item => <SelectItem>{ label: item, value: item }))
    );
  }

}
