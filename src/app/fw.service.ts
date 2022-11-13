import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FwNote, FwTag } from './fw-note';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FwService {

  dstamp: Date;
  note: FwNote;
  tags: string[];
  tagList: FwTag[];
  visitedPatterns = {};
  
  CAT_ALL = 'Все';
  CAT_NONE = 'Без категории';

  constructor(private http: HttpClient) { 
    this.loadTags();
  }

  loadNote(dstamp: string): Observable<FwNote>  {
    const p = new HttpParams().set('d', dstamp);
    return this.http.get<FwNote>(environment.API_URL_BASE + '/fw', { params: p });
  }

  loadTags(): Observable<string[]>  {
    let observable = this.http.get<string[]>(environment.API_URL_BASE + '/fw/tags');
    new Observable(observer => {
      observable.subscribe((tagList: string[]) => {
        console.log('-- Tags loaded');
        this.tags = tagList;
        observer.next(tagList);
        observer.complete();
      });
    });
    return observable;
  }

  loadTagsByCategory(cat: string): Observable<string[]> {
    let options = {
      params: new HttpParams()
    };

    if (cat === this.CAT_ALL) {
      cat = '*'
    } else
    if (cat === this.CAT_NONE) {
      cat = '';
    }

    options.params = new HttpParams().set('c', cat);
    let observable = this.http.get<FwTag[]>(environment.API_URL_BASE + '/fw/ctags', options);
    // new Observable(observer => {
      observable.subscribe((tagList: FwTag[]) => {
        this.tags = tagList.map(tag => tag.name);
        this.tagList = tagList;
        console.log('-- tagList:', this.tagList);
        // observer.next(tagList);
        // observer.complete();
      });
    // });
    return observable.pipe(map((fwTags: FwTag[]) => fwTags.map((fwTag: FwTag) => fwTag.name)));
  }

  loadPatterns(): Observable<string[]>  {
    return this.http.get<string[]>(environment.API_URL_BASE + '/fw/patterns');
  }

  loadCategories(): Observable<string[]>  {
    return this.http.get<string[]>(environment.API_URL_BASE + '/fw/cats');
  }

  findPattern(pattern: string): Observable<string[]>  {
    return this.http.get<string[]>(environment.API_URL_BASE + '/fw/findPattern', {
      params: {
        p: pattern
      }
    });
  }

  updateTags(tags: string[]) {
    this.http.post(environment.API_URL_BASE + '/fw/updateNoteTags', {
      d: this.dateStr(this.dstamp),
      newTags: tags
    }).subscribe();
  }

  setNote(dstamp: Date, note: FwNote) {
    this.dstamp = dstamp;
    this.note = note;
  }

  dateStr(dstamp: Date): string {
    return formatDate(dstamp, 'YYYY-MM-dd', 'en-US');
  }

  markVisited(date: Date) {
    this.visitedPatterns[date.toISOString()] = true;
  }

  isVisited(date: Date): boolean {
    return this.visitedPatterns[date.toISOString()];
  }
}
