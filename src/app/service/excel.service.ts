import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Heritage } from '../class/heritage';

const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: Heritage[], excelFileName: string): void {
    console.log(json);
    const data = json.sort((a, b) => (a.id - b.id)).map((item => this.convertHeritage(item)));
    const fileName = excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, fileName, { bookType: 'xlsx', type: 'buffer' });
  }

  private convertHeritage(heritage: Heritage): any {
    return {
      'ID': heritage.id,
      'Tên': heritage.name,
      'Kiểu': heritage.type,
      'Ký hiệu': heritage.label,
      'Huyện': heritage.district,
      'Xã': heritage.commune,
      'Kinh độ': heritage.geometry.coordinates[1],
      'Vĩ độ': heritage.geometry.coordinates[0]
    };
  }

  public printDirectly(json: Heritage[]) {
    const data = json.sort((a, b) => (a.id - b.id)).map((item => this.convertHeritage(item)));
    let html = '<table>';
    html += '<tr>';
    const keys = Object.keys(data[0]);
    keys.forEach(key => {
      html += `<th>${key}</th>`;
    });
    html += '</tr>';

    data.forEach(item => {
      html += '<tr>';
      keys.forEach(key => {
        html += `<td>${item[key]}</td>`;
      });
      html += '</tr>';
    });

    // console.log(html);
    const newWin = window.open();
    newWin.document.write(html);
    newWin.print();
    newWin.close();
  }


}
