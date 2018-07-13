import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { GeologicalHeritage } from '../models/geological-heritage';
import { CulturalHeritage } from '../models/cultural-heritage';
import { Heritage } from '../models/heritage';
import { merge } from 'rxjs/observable/merge';

@Injectable()
export class HeritageService {

  private _cache_geological_heritages: GeologicalHeritage[];
  private _geological_heritages_url = '/assets/data/DiemDiSan_0.json';
  private _cache_cultural_heriatages: CulturalHeritage[];
  private _cultural_heritages_url = '/assets/data/DiemDiSan_0.json';


  constructor(
    private http: HttpClient
  ) { }

  public getGeologicalHeritages(): Observable<GeologicalHeritage[]> {
    if (this._cache_geological_heritages) {
      return of(this._cache_geological_heritages);
    } else {
      return this.http.get<GeologicalHeritage[]>(this._geological_heritages_url);
    }
  }

  public getCulturalHeritages(): Observable<CulturalHeritage[]> {
    if (this._cache_cultural_heriatages) {
      return of(this._cache_cultural_heriatages);
    } else {
      return this.http.get<CulturalHeritage[]>(this._cultural_heritages_url);
    }
  }

  public getHeritages(type: HeritageType) {
    let items: Observable<Heritage[]>;
    if (type === HeritageType.GeologicalHeritage) {
      items = this.getGeologicalHeritages();
    }

    switch (type) {
      case HeritageType.GeologicalHeritage:
        items = this.getGeologicalHeritages();
        break;
      case HeritageType.CulturalHeritage:
        items = this.getCulturalHeritages();
        break;
      case HeritageType.Both:
        items = merge(this.getCulturalHeritages(), this.getGeologicalHeritages());
        break;
      default:
        items = of([]);
    }
    return items;
  }

  public suggest(query: string, feild: string, type: HeritageType, searchObjects: SearchObject[]): Observable<string[]> {
    query = query.trim().toLocaleLowerCase();
    return this.getHeritages(type).pipe(
      map(data => {
        const set = new Set(data.map(item => item[feild]));
        return Array.from(set);
      }),
      map(data => data.filter((item) => query !== '' && item.toLocaleLowerCase().indexOf(query) > -1)),
    );
  }

  public getDistinstValues(fieldName: string, type: HeritageType, searchObjects): Observable<string[]> {
    return this.getHeritages(type).pipe(
      map(data => {
        const set = new Set(data.map(item => item[fieldName]));
        return Array.from(set);
      })
    );
  }

  public search(searchObjects: SearchObject[], type: HeritageType): Observable<Heritage[]> {
    return this.getHeritages(type).pipe(
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

export enum HeritageType {
  GeologicalHeritage,
  CulturalHeritage,
  Both
}
