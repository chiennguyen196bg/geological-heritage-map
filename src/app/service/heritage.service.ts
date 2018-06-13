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
      _.attachedFile = item.properties['attachedFile'];
      _.commune = item.properties['Xa'];
      _.district = item.properties['Huyen'];
      _.geometry = item['geometry'];
      _.geometry.coordinates.reverse();
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

  public getDistinstValues(fieldName: string): Observable<string[]> {
    return this.getHeritages().pipe(
      map(data => {
        const set = new Set(data.map(item => item[fieldName]));
        return Array.from(set);
      })
    );
  }

  public search(...searchObjects: SearchObject[]): Observable<Heritage[]> {
    return this.getHeritages().pipe(
      map(data => {
        searchObjects.forEach(ele => {
          if (ele.type === 'single') {
            if (Array.isArray(ele.value)) {
              throw new TypeError('Value field must be string, not array.');
            }
            data = data.filter(item => item[ele.field].toLocaleLowerCase().indexOf((ele.value as string).toLocaleLowerCase()) > -1);
          } else {
            if (!Array.isArray(ele.value)) {
              throw new TypeError('Value field must be array');
            }
            if (ele.type === 'or') {
              data = data.filter(item => this.orFilter(item, ele.field, ele.value as string[]));
            } else if (ele.type === 'and') {
              data = data.filter(item => this.andFilter(item, ele.field, ele.value as string[]));
            } else {
              throw new TypeError('Type is not supported');
            }
          }
        });
        return data;
      })
    );
  }

  private andFilter(data: Heritage, field: string, value: string[]): boolean {
    for (let i = 0; i < value.length; i++) {
      const element = value[i];
      if (data[field].toLocaleLowerCase().indexOf(element.toLocaleLowerCase()) === -1) {
        return false;
      }
    }
    return true;
  }

  private orFilter(data: Heritage, field: string, value: string[]): boolean {
    for (let i = 0; i < value.length; i++) {
      const element = value[i];
      if (data[field].toLocaleLowerCase() === element.toLocaleLowerCase()) {
        return true;
      }
    }
    return false;
  }
}

export interface SearchObject {
  field: string;
  value: string[] | string;
  type: 'and' | 'or' | 'single';
}
