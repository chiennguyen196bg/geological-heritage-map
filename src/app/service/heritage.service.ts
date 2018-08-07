import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Heritage } from '../models/heritage';

@Injectable()
export class HeritageService {

  private _cache: Heritage[];
  private _url = '/assets/data/DiemDiSanGop_0.json';

  constructor(
    private http: HttpClient
  ) { }

  public getHeritages(): Observable<Heritage[]> {
    if (this._cache) {
      return of(this._cache);
    } else {
      return this.http.get<Heritage[]>(this._url).pipe(
        map(data => {
          return data.map(item => {
            item.geometry.coordinates.reverse();
            return item;
          });
        }),
        tap(data => this._cache = data)
      );
    }
  }

  public suggest(query: string, feild: string, searchObjects: SearchObject[] = []): Observable<string[]> {
    query = query.trim().toLocaleLowerCase();
    return this.search(searchObjects).pipe(
      map(data => {
        const set = new Set(data.map(item => item[feild]));
        return Array.from(set);
      }),
      map(data => data.filter((item) => query !== '' && item.toLocaleLowerCase().indexOf(query) > -1)),
    );
  }

  public getDistinstValues(fieldName: string, searchObjects: SearchObject[]): Observable<string[]> {
    return this.search(searchObjects).pipe(
      map(data => {
        const set = new Set(data.map(item => item[fieldName]));
        return Array.from(set);
      })
    );
  }

  public search(searchObjects: SearchObject[]): Observable<Heritage[]> {
    // console.log('Search!');
    return this.getHeritages().pipe(
      // tap(_ => console.log('hehe')),
      map(data => {
        console.log(searchObjects);
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
