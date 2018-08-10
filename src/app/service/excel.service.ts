import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Heritage } from '../models/heritage';

const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: Heritage[], excelFileName: string): void {
    console.log(json);
    const data = json.sort((a, b) => (a.TT - b.TT)).map((item => this.convertHeritage(item)));
    const fileName = excelFileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, fileName, { bookType: 'xlsx', type: 'buffer' });
  }

  private convertHeritage(heritage: Heritage): any {
    return {
      'TT': heritage.TT,
      'Tên': heritage.TenDiSan,
      'Kiểu': heritage.KieuDiSan,
      // 'Ký hiệu': heritage.label,
      'Huyện': heritage.Huyen,
      'Xã': heritage.Xa,
      'Kinh độ': heritage.geometry.coordinates[1],
      'Vĩ độ': heritage.geometry.coordinates[0],
      'Hiện Trạng Bảo Vệ': heritage.HienTrangB,
      'Thông tin xếp hạng': heritage.ThongTinXe
    };
  }

  public printDirectly(json: Heritage[]) {
    const data = json.sort((a, b) => (a.TT - b.TT)).map((item => this.convertHeritage(item)));
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

    html += `
    <style>
      table {
        border-collapse: collapse;
      }
      table, th, td {
          border: 1px solid black;
      }
    </style>
    `;

    // console.log(html);
    const newWin = window.open();
    newWin.document.write(html);
    newWin.print();
    newWin.close();
  }


}
