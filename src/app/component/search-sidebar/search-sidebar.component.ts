import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HeritageService, SearchObject } from '../../service/heritage.service';
import { Observable } from 'rxjs/Observable';
import { SelectItem } from 'primeng/api';
import { catchError, map, tap } from 'rxjs/operators';
import { Heritage } from '../../models/heritage';

@Component({
  selector: 'app-search-sidebar',
  templateUrl: './search-sidebar.component.html',
  styleUrls: ['./search-sidebar.component.css']
})
export class SearchSidebarComponent {

  loaiDiSan;
  TenDiSan = '';
  kieuDiSanVanHoa = '';
  kieuDiSanDiaChat = [];
  xa = [];
  huyen = [];

  private loaiDiSanOptions = [
    { label: 'Địa chất', value: 'Địa chất' },
    { label: 'Văn Hóa', value: 'Văn Hóa' }
  ];

  private kieuDiSanDiaChatOption = [
    { label: 'A_Cổ sinh', value: 'A' },
    { label: 'B_Địa mạo', value: 'B' },
    { label: 'C_Cổ môi trường', value: 'C' },
    { label: 'D_Đá', value: 'D' },
    { label: 'E_Địa tầng', value: 'E' },
    { label: 'F_Khoáng vật, khoáng sản', value: 'F' },
  ];



  private kieuDiSanVanHoaOption = [];



  TenDiSanSuggestion = [];
  @Output() searched = new EventEmitter<Heritage[]>();

  constructor(
    private heritageService: HeritageService
  ) { }

  private getSearchObjects(): SearchObject[] {
    const searchObjects: SearchObject[] = [];
    if (!this.loaiDiSan) {
      return [];
    }
    searchObjects.push({ field: 'LoaiDiSan', value: this.loaiDiSan, type: 'single' });
    if (this.TenDiSan !== '') {
      searchObjects.push({ field: 'TenDiSan', value: this.TenDiSan, type: 'single' });
    }
    if (this.huyen.length > 0) {
      searchObjects.push({ field: 'Huyen', value: this.huyen, type: 'or' });
    }
    if (this.xa.length > 0) {
      searchObjects.push({ field: 'Xa', value: this.xa, type: 'or' });
    }

    if (this.kieuDiSanDiaChat.length > 0 && this.loaiDiSan === 'Địa chất') {
      searchObjects.push({ field: 'KieuDiSan', value: this.kieuDiSanDiaChat, type: 'and' });
    }

    if (this.loaiDiSan === 'Văn Hóa' && this.kieuDiSanVanHoa !== '') {
      searchObjects.push({ field: 'KieuDiSan', value: this.kieuDiSanVanHoa, type: 'single' });
    }
    return searchObjects;
  }

  search() {
    this.heritageService.search(this.getSearchObjects()).subscribe(data => {
      this.searched.emit(data);
    });
  }

  suggestTenDiSan(event) {
    this.heritageService.suggest(event.query, 'TenDiSan').subscribe(data => this.TenDiSanSuggestion = data);
  }

  getDistinstValues(fieldName: string): Observable<SelectItem[]> {
    // console.log('Here');
    return this.heritageService.getDistinstValues(fieldName, [
      { field: 'LoaiDiSan', value: this.loaiDiSan, type: 'single' }]).pipe(
      map(data => {
        if (!data) {
          return [];
        } else {
          return data;
        }
      }),
      map(data => data.map(item => <SelectItem>{ label: item, value: item }))
    );
  }

  reset() {
    this.loaiDiSan = false;
    this.TenDiSan = '';
    this.kieuDiSanVanHoa = '';
    this.kieuDiSanDiaChat = [];
    this.xa = [];
    this.huyen = [];
  }

}
