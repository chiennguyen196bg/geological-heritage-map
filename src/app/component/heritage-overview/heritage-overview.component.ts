import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Heritage } from '../../models/heritage';

@Component({
  selector: 'app-heritage-overview',
  templateUrl: './heritage-overview.component.html',
  styleUrls: ['./heritage-overview.component.css']
})
export class HeritageOverviewComponent implements OnInit {

  @Input() heritage: Heritage;
  @Output() closed = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.closed.emit();
  }

  seeMore() {
    window.open(this.heritage.Link, '_blank');
  }

}
