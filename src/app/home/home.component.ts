import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(event): void {
    const dstr = formatDate(event.value, 'YYYY-MM-dd', 'en-US');
    console.log('onSelect:', dstr);
  }
}
