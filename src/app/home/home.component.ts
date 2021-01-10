import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FwService } from '../fw.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  textNote;
  dstamp;

  STORAGE_DATE = 'fw-date';

  constructor(
    private fwService: FwService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
      /* Проверить, имеется ли дата в урле.
       */
      let dstr = this.route.snapshot.paramMap.get('d');
      if (!dstr) {
        dstr = localStorage.getItem(this.STORAGE_DATE);
      }

      if (dstr) {
        /* Выставить календарь соответственно.
         */
        this.dstamp = new Date(dstr);

        /* Загрузить указанную заметку.
         */
        this.fwService.getNote(dstr).subscribe(note => {
          this.textNote = note.text;
        });
      }
  }

  onSelect(event): void {
    /* Привести значение из календаря к нужному формату.
     */
    const dstr = formatDate(this.dstamp, 'YYYY-MM-dd', 'en-US');
    localStorage.setItem(this.STORAGE_DATE, dstr); // this.dstamp.toISOString().substring(0, 10));

    /* Загрузить выбранную заметку.
     */
    this.fwService.getNote(dstr).subscribe(note => {
      this.textNote = note.text;
    });
  }
}
