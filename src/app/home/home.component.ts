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
      this.loadNote(dstr);
    }
  }

  onSelect(): void {
    /* Привести значение из календаря к нужному формату.
     */
    const dstr = this.dateStr();
    this.loadNote(dstr);
  }

  dateStr(): string {
    return formatDate(this.dstamp, 'YYYY-MM-dd', 'en-US');
  }

  /** Загрузить выбранную заметку.
   */
  loadNote(dstr: string): void {
    this.fwService.loadNote(dstr).subscribe((note: FwNote) => {
      this.setNote(dstr, note);
      localStorage.setItem(this.STORAGE_DATE, dstr);
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

  onPrevNote(): void {
    this.dstamp.setDate(this.dstamp.getDate() - 1);
    this.loadNote(this.dateStr());
  }

  onNextNote(): void {
    this.dstamp.setDate(this.dstamp.getDate() + 1);
    this.loadNote(this.dateStr());
  }

  onAerostat(): void {
    window.open('https://aerostatbg.ru/release/' + this.getAerostat(this.dstamp), '_blank');
  }

  getAerostat(date: Date): number {
    const t1 = date.getTime();
    const t2 = new Date('2005-05-21').getTime();
    if (t1 > t2) {
      return Math.ceil((date.getTime() - new Date('2005-05-21').getTime()) / 86400000 / 7);
    } else {
      return 1;
    }
  }
}
