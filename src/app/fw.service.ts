import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FwNote, FwTag } from './fw-note';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FwService {
  serverUrl = 'http://192.168.100.7:8080/pi';
  dstamp: Date;
  note: FwNote;
  tags: string[];
  visitedPatterns = {};

  constructor(private http: HttpClient) { }

  loadNote(dstamp: string): Observable<FwNote>  {
    const p = new HttpParams().set('d', dstamp);
    return this.http.get<FwNote>(environment.API_URL_BASE + '/fw', { params: p });
  }

  loadTags() {
    this.http.get<string[]>(environment.API_URL_BASE + '/fw/tags').subscribe((tagList: string[]) => {
      this.tags = tagList;
    });
  }

  loadPatterns(): Observable<string[]>  {
    return this.http.get<string[]>(environment.API_URL_BASE + '/fw/patterns');
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
