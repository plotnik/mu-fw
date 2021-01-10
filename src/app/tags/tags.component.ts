import { Component, OnInit } from '@angular/core';
import { FwService } from '../fw.service';
import { FwNote, FwTag } from '../fw-note';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  dstamp: string;
  note: FwNote;
  tagNames: string[];

  constructor(private fwService: FwService) { }

  ngOnInit(): void {
    this.dstamp = this.fwService.dstamp;
    this.note = this.fwService.note;
    this.tagNames = this.note.tags.map(tag => tag.name);
  }

}
