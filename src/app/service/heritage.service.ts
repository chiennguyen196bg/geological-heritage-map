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
      _.id = item.properties['ID'];
      _.name = item.properties['Ten'];
      _.type = item.properties['Kieu'];
      _.label = item.properties['KyHieu'];
      // _.attachedFile = item.properties['Link'];
      _.commune = item.properties['Xa'];
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
        return data.filter((item: Heritage) => (item.name.toLocaleLowerCase().indexOf(name) > -1 || name === ''));
      }),
      map(data => {
        return data.filter((item: Heritage) => (item.district.toLocaleLowerCase().indexOf(districtName) > -1 || districtName === ''));
      }),
      map(data => {
        return data.filter((item: Heritage) => (item.commune.toLocaleLowerCase().indexOf(communeName) > -1 || communeName === ''));
      }),
    );
  }

  public suggest(query: string, feild: string): Observable<string[]> {
    query = query.trim().toLocaleLowerCase();
    return this.getHeritages().pipe(
      map(data => {
        const set = new Set(data.map(item => item[feild]));
        return Array.from(set);
      }),
      map(data => data.filter((item) => query !== '' && item.toLocaleLowerCase().indexOf(query) > -1)),
    );
  }

}
