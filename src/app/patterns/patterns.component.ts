import { Component, OnInit } from '@angular/core';

import { FwService } from '../fw.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patterns',
  templateUrl: './patterns.component.html',
  styleUrls: ['./patterns.component.scss']
})
export class PatternsComponent implements OnInit {

  // шаблоны поиска
  patterns: string[] = [];

  constructor(private fwService: FwService, private router: Router) { }

  ngOnInit(): void {
    this.fwService.loadPatterns().subscribe((patList: string[]) => {
      this.patterns = patList;
    })
  }

  findPattern(pattern: string) {
    this.router.navigate(['/pattern', pattern]);
  }

}
