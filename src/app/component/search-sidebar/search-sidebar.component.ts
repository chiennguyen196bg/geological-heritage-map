import { Component, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HeritageService, SearchObject } from '../../service/heritage.service';
import { Observable } from 'rxjs/Observable';
import { SelectItem } from 'primeng/api';
import { catchError, map, tap, mergeAll } from 'rxjs/operators';
import { Heritage } from '../../models/heritage';
import { HERITAGE_TYPE } from '../../config/heritage-type';
import { zip } from 'rxjs/observable/zip';

@Component({
  selector: 'app-search-sidebar',
  templateUrl: './search-sidebar.component.html',
  styleUrls: ['./search-sidebar.component.css']
})
export class SearchSidebarComponent {
  HERITAGE_TYPE = HERITAGE_TYPE;

  loaiDiSanList = [];
  HeritageTypes = [
    HERITAGE_TYPE.DIA_CHAT, HERITAGE_TYPE.VAN_HOA, HERITAGE_TYPE.SINH_HOC
  ];
  TenDiSan = '';
  kieuDiSanVanHoa = '';
  kieuDiSanSinhHoc = '';
  kieuDiSanDiaChat = [];
  xa = [];
  huyen = [];

  loaiDiSanOptions = [
    { label: HERITAGE_TYPE.DIA_CHAT, value: HERITAGE_TYPE.DIA_CHAT },
    { label: HERITAGE_TYPE.VAN_HOA, value: HERITAGE_TYPE.VAN_HOA }
  ];

  kieuDiSanDiaChatOption = [
    { label: 'A_Cổ sinh', value: 'A' },
    { label: 'B_Địa mạo', value: 'B' },
    { label: 'C_Cổ môi trường', value: 'C' },
    { label: 'D_Đá', value: 'D' },
    { label: 'E_Địa tầng', value: 'E' },
    { label: 'F_Khoáng vật, khoáng sản', value: 'F' },
  ];




  TenDiSanSuggestion = [];
  @Output() searched = new EventEmitter<Heritage[]>();

  constructor(
    private heritageService: HeritageService
  ) { }

  private getSearchObjects(heritageType): SearchObject[] {
    const searchObjects: SearchObject[] = [];

    searchObjects.push({ field: 'LoaiDiSan', value: heritageType, type: 'single' });

    if (this.TenDiSan !== '') {
      searchObjects.push({ field: 'TenDiSan', value: this.TenDiSan, type: 'single' });
    }
    if (this.huyen.length > 0) {
      searchObjects.push({ field: 'Huyen', value: this.huyen, type: 'or' });
    }
    if (this.xa.length > 0) {
      searchObjects.push({ field: 'Xa', value: this.xa, type: 'or' });
    }

    if (heritageType === HERITAGE_TYPE.DIA_CHAT) {
      if (this.kieuDiSanDiaChat.length > 0) {
        searchObjects.push({ field: 'KieuDiSan', value: this.kieuDiSanDiaChat, type: 'and' });
      }
    }

    if (heritageType === HERITAGE_TYPE.VAN_HOA) {
      if (this.kieuDiSanVanHoa !== '') {
        searchObjects.push({ field: 'KieuDiSan', value: this.kieuDiSanVanHoa, type: 'single' });
      }
    }

    if (heritageType === HERITAGE_TYPE.SINH_HOC) {
      if (this.kieuDiSanSinhHoc !== '') {
        searchObjects.push({ field: 'KieuDiSan', value: this.kieuDiSanSinhHoc, type: 'single' });
      }
    }
    return searchObjects;
  }

  search() {

    const mergeSearchs: Observable<Heritage[]>[] = [];

    if (this.loaiDiSanList.indexOf(HERITAGE_TYPE.DIA_CHAT) > -1) {
      console.log(this.getSearchObjects(HERITAGE_TYPE.DIA_CHAT));
      mergeSearchs.push(this.heritageService.search(this.getSearchObjects(HERITAGE_TYPE.DIA_CHAT)));
    }
    if (this.loaiDiSanList.indexOf(HERITAGE_TYPE.VAN_HOA) > -1) {
      console.log(this.getSearchObjects(HERITAGE_TYPE.VAN_HOA));
      mergeSearchs.push(this.heritageService.search(this.getSearchObjects(HERITAGE_TYPE.VAN_HOA)));
    }
    if (this.loaiDiSanList.indexOf(HERITAGE_TYPE.SINH_HOC) > -1) {
      console.log(this.getSearchObjects(HERITAGE_TYPE.SINH_HOC));
      mergeSearchs.push(this.heritageService.search(this.getSearchObjects(HERITAGE_TYPE.SINH_HOC)));
    }

    zip(...mergeSearchs).subscribe(data => {
      const merged = data.reduce(function (prev, next) {
        return prev.concat(next);
      });
      this.searched.emit(merged);
    });

    // this.heritageService.search(this.getSearchObjects()).subscribe(data => {
    //   this.searched.emit(data);
    // });
  }

  suggestTenDiSan(event) {
    this.heritageService.suggest(event.query, 'TenDiSan').subscribe(data => this.TenDiSanSuggestion = data);
  }

  getDistinstValues(fieldName: string, heritageType = null): Observable<SelectItem[]> {

    let searchObject: SearchObject;
    if (heritageType) {
      searchObject = { field: 'LoaiDiSan', value: heritageType, type: 'single' };
    } else {
      searchObject = { field: 'LoaiDiSan', value: this.loaiDiSanList, type: 'or' };
    }
    // console.log('Here');
    return this.heritageService.getDistinstValues(fieldName, [searchObject]).pipe(
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
    this.loaiDiSanList = [];
    this.TenDiSan = '';
    this.kieuDiSanVanHoa = '';
    this.kieuDiSanDiaChat = [];
    this.xa = [];
    this.huyen = [];
  }

  getDistinstValuesForXa(): Observable<SelectItem[]> {
    return this.heritageService.getDistinstValues('Xa', [
      { field: 'LoaiDiSan', value: this.loaiDiSanList, type: 'or' },
      { field: 'Huyen', value: this.huyen, type: 'or' }
    ]).pipe(
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

}
