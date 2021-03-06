import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FwNote } from './fw-note';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FwService {
  serverUrl = 'http://192.168.100.7:8080/pi';
  dstamp: string;
  note: FwNote;

  constructor(private http: HttpClient) { }

  loadNote(dstamp: string): Observable<FwNote>  {
    const p = new HttpParams().set('d', dstamp);
    return this.http.get<FwNote>(environment.API_URL_BASE + '/fw', { params: p });
  }

  setNote(dstamp: string, note: FwNote): void {
    this.dstamp = dstamp;
    this.note = note;
  }
}
