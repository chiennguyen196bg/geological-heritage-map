import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
// import * as L from 'leaflet';
import { Heritage } from '../../class/heritage';
import { marker, tileLayer, latLng, icon } from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit, OnChanges {

  @Input() data: Heritage[];
  @Output() markerClicked = new EventEmitter<Heritage>();

  options: any;
  layers: any[];
  constructor() { }

  ngOnInit() {
    console.log('On init');
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: latLng(12.4587489, 107.9188864)
    };
    console.log(this.data);
    this.layers = [
      // circle([ 46.95, -122 ], { radius: 5000 }),
      // polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
      marker([46.879966, -121.726909])
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Onchanges');
    console.log(this.data);
    if (this.data) {
      this.layers = this.data.map(item => {
        const coordinates = item.geometry.coordinates;
        return marker(latLng(coordinates[1], coordinates[0]), {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: 'assets/marker-icon.png',
            shadowUrl: 'assets/marker-shadow.png'
          })
        }).on('click', () => {
          console.log('click on marker: ' + item.sign);
          this.markerClicked.emit(item);
        });
      });
    }
  }

}
