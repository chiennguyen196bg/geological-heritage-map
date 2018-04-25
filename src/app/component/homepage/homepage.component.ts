import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import * as L from 'leaflet';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  items: MenuItem[];
  options: any;
  results: any[];
  selectedResult: any;


  constructor() { }

  ngOnInit() {
    this.items = [
      { label: 'Di sản địa chất'},
    ];
    this.options = {
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: L.latLng(46.879966, -121.726909)
    };
    this.results = [
      {
        name: 'Test1',
        localName: 'Local name',
        district: 'string',
        commune: 'string',
        village: 'string',
        scale: 'string',
      },
      {
        name: 'Test2',
        localName: 'Local name',
        district: 'string',
        commune: 'string',
        village: 'string',
        scale: 'string',
      },
      {
        name: 'Test3',
        localName: 'Local name',
        district: 'string',
        commune: 'string',
        village: 'string',
        scale: 'string',
      }
    ];
  }

}
