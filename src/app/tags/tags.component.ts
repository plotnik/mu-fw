import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FwService } from '../fw.service';
import { FwNote, FwTag } from '../fw-note';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  note: FwNote;

  // текущий набор тэгов
  tagNames: string[];

  // полный набор тэгов
  allTagNames: string[];

  filteredTags: Observable<string[]>;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  tagForm: FormGroup;
  tagCtrl = new FormControl();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  constructor(private fwService: FwService, private router: Router) {
    this.allTagNames = this.fwService.tags; // .map(tag => tag.name);
    // console.log('--- allTagNames:', this.allTagNames);
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(''),
      map((tname: string | null) => tname ? this._filter(tname) : this.allTagNames.slice()));
  }

  private _filter(value: string): string[] {
    // console.log('--- _filter:', value);
    const filterValue = value.toLowerCase();
    return this.allTagNames.filter(tag => tag.toLowerCase().indexOf(filterValue) >= 0);
  }

  ngOnInit(): void {
    this.note = this.fwService.note;
    this.tagNames = this.note.tags? this.note.tags.map(tag => tag.name) : [];
    console.log('--- tagNames:', this.tagNames);

    this.tagForm = new FormGroup({
      tagCtrl: new FormControl()
     });
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();
    console.log('--- addTag:', value);

    if (value) {
      const f1 = this.allTagNames.filter(tag => tag === value);
      const f2 = this.tagNames.filter(tag => tag === value);
      if (f1.length > 0 && f2.length === 0) {
        this.tagNames.push(value);
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    console.log('--- selected:', value);
    this.tagNames.push(value);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  remove(tagName: string): void {
    // console.log('--- removing', tagName);
    this.tagNames = this.tagNames.filter(tag => tag !== tagName);
  }

  submit() {
    console.log('--- tagNames', this.tagNames);
    this.fwService.updateTags(this.tagNames);
    this.router.navigate(['']);
  }
}
