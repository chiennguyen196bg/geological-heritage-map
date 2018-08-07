import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Heritage } from '../../models/heritage';
import { ExcelService } from '../../service/excel.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent {

  @Input() searchResults: Heritage[] = [];
  @Output() resultSelected = new EventEmitter<Heritage>();

  constructor(
    private excelService: ExcelService,
  ) { }

  onResultSelected(event) {
    this.resultSelected.emit(event.data);
  }

  public exportExcel() {
    this.excelService.exportAsExcelFile(this.searchResults, 'result');
  }

  public printDirectly() {
    this.excelService.printDirectly(this.searchResults);
  }

}
