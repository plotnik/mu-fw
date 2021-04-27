import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { FwService } from '../fw.service';
import { FwNote, FwTag } from '../fw-note';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  textNote: string;
  tags: FwTag[];
  dstamp: Date;

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

      /* Загрузить тэги в сервис
       */
      this.fwService.loadTags();

      if (dstr) {
        /* Выставить календарь соответственно.
         */
        this.dstamp = new Date(dstr);

        /* Загрузить указанную заметку.
         */
        this.fwService.loadNote(dstr).subscribe((note: FwNote) => {
          this.setNote(dstr, note);
        });
      }
  }

  onSelect(): void {
    /* Привести значение из календаря к нужному формату.
     */
    const dstr = formatDate(this.dstamp, 'YYYY-MM-dd', 'en-US');
    localStorage.setItem(this.STORAGE_DATE, dstr);

    /* Загрузить выбранную заметку.
     */
    this.fwService.loadNote(dstr).subscribe((note: FwNote) => {
      this.setNote(dstr, note);
    });
  }

  setNote(dstr: string, note: FwNote): void {
    if (note.dateStr) {
      const underline = '-'.repeat(note.dateStr.length);
      this.textNote = note.dateStr + '\n' + underline + '\n' + note.text;
      this.tags = note.tags;
      this.fwService.setNote(dstr, note);
    } else {
      this.textNote = undefined;
    }
  }

  onTagSelect(tag: FwTag): void {
    window.open(tag.url, '_blank');
  }
}
