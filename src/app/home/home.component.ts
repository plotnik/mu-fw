import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FwService } from '../fw.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  textNote;
  dstamp;

  STORAGE_DATE = 'fw-date';

  constructor(private fwService: FwService) { }

  ngOnInit(): void {
      const dstr = localStorage.getItem(this.STORAGE_DATE);
      if (dstr) {
        this.dstamp = new Date(dstr);
      }
  }

  onSelect(event): void {
    // const d = event.value;
    const d = this.dstamp;

    const dstr = formatDate(d, 'YYYY-MM-dd', 'en-US');
    console.log('onSelect:', dstr);
    this.fwService.getNote(dstr).subscribe(note => {
      this.textNote = note.text;
      localStorage.setItem(this.STORAGE_DATE, this.dstamp.toISOString());
    });
  }
}
