import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { FwNote } from '../fw-note';
import { FwService } from '../fw.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  note: FwNote;

  // текущий набор тэгов
  tagNames: string[] = [];

  // полный набор тэгов
  allTagNames: string[] = [];

  // список категорий тэгов
  categories: string[] = [];

  // тэги отфильтрованные через поле поиска
  filteredTags: Observable<string[]>;

  // тэги отфильтрованные через селектор категорий
  catFilteredTags: string[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  tagForm: FormGroup;
  tagCtrl = new FormControl();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  constructor(private fwService: FwService, private router: Router) {
    new Observable(observer => {
      this.fwService.loadTags().subscribe((tagList: string[]) => {
        this.allTagNames = this.fwService.tags; // .map(tag => tag.name);
        this.catFilteredTags = this.allTagNames;
        console.log('catFilteredTags.length:', this.catFilteredTags.length);

        observer.next(tagList);
        observer.complete();
      });
    });

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

    this.fwService.loadCategories().subscribe((catList: string[]) => {
      this.categories = catList;
      this.categories.unshift(this.fwService.CAT_ALL);
      this.categories.push(this.fwService.CAT_NONE);
    })

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

  selectCategory(category: string) {
    console.log('category:', category);
    this.fwService.loadTagsByCategory(category).subscribe(tags => {
      this.catFilteredTags = tags;
      console.log('catFilteredTags.length:', this.catFilteredTags.length);
    });
  }
  
  selectTag(tag: string) {
    console.log('tag:', tag);
    console.log('tagList:', this.fwService.tagList);
    let it = this.fwService.tagList.find(t => t.name===tag);
    console.log('url:', it.url);
    window.open(it.url, '_blank');
  }

}
