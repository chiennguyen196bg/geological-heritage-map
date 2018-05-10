import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Heritage } from '../class/heritage';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class HeritageService {

  private _cache: Heritage[];
  private _url = '/assets/data/DiemDiSan_0.json';

  constructor(
    private http: HttpClient
  ) { }

  public getHeritages(): Observable<Heritage[]> {
    if (this._cache) {
      return of(this._cache);
    } else {
      return this.http.get(this._url).pipe(
        map(res => {
          this._cache = this.convertToModels(res['features']);
          return this._cache;
        })
      );
    }
  }

  private convertToModels(data: any[]): Heritage[] {
    return data.map(item => {
      // console.log(item);
      const _ = new Heritage();
      _.sign = item.properties['KyHieu'];
      _.featured = item.properties['Dac_Diem'];
      _.location = item.properties['ViTri'];
      _.x = item.properties['X'];
      _.y = item.properties['Y'];
      _.type = item.properties['KieuDiSan'].replace(/\s/g, '').split(',');
      _.attachedFile = item.properties['Link'];
      _.district = item.properties['Huyen'];
      _.geometry = item['geometry'];
      return _;
    });
  }

  public searchHeritages(name = '', districtName = '', communeName = ''): Observable<Heritage[]> {
    name = name.trim().toLocaleLowerCase();
    districtName = districtName.trim().toLocaleLowerCase();
    communeName = communeName.trim().toLocaleLowerCase();
    return this.getHeritages().pipe(
      map(data => {
        return data.filter((item: Heritage) => (item.sign.toLocaleLowerCase().indexOf(name) > -1 || name === ''));
      }),
      map(data => {
        return data.filter((item: Heritage) => (item.district.toLocaleLowerCase().indexOf(districtName) > -1 || districtName === ''));
      }),
      map(data => {
        return data.filter((item: Heritage) => (item.location.toLocaleLowerCase().indexOf(communeName) > -1 || communeName === ''));
      }),
    );
  }

}
