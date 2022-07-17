import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { FwService } from '../fw.service';

@Component({
  selector: 'app-pattern',
  templateUrl: './pattern.component.html',
  styleUrls: ['./pattern.component.css']
})
export class PatternComponent implements OnInit {

  dates: Date[];
  visited = {};

  constructor(private fwService: FwService, 
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    let pstr = this.route.snapshot.paramMap.get('p');
    this.fwService.findPattern(pstr).subscribe(dates => {
      this.dates = dates.map(it => new Date(it));
    });
  }

  openDate(date: Date) {
    this.fwService.markVisited(date);
    this.router.navigate(['/home/' + this.fwService.dateStr(date)]);
  }

  isVisited(date: Date): boolean {
    return this.fwService.isVisited(date);
  }
}
