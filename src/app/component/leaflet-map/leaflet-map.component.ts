import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, NgZone } from '@angular/core';
// import * as L from 'leaflet';
import { Heritage } from '../../class/heritage';
import { marker, tileLayer, latLng, icon, Map } from 'leaflet';

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
  map: Map;
  constructor(
    private _ngZone: NgZone
  ) { }

  ngOnInit() {
    console.log('On init');
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 10,
      center: latLng(12.4587489, 107.9188864)
    };
    // console.log(this.data);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Onchanges');
    console.log(this.data);
    if (this.data) {
      this.layers = this.data.map(item => {
        const coordinates = item.geometry.coordinates;
        return marker(latLng(coordinates[1], coordinates[0]), {
          icon: icon({
            // iconSize: [25, 41],
            // iconAnchor: [13, 41],
            // iconUrl: 'assets/marker-icon.png',
            // shadowUrl: 'assets/marker-shadow.png',
            iconUrl: 'assets/images/DiemDiSan_0_8.png'
          })
        }).on('click', () => {
          console.log('click on marker: ' + item.sign);
          this._ngZone.run(() => {
            this.markerClicked.emit(item);
          });
        });
      });
    }
  }
  public flyToHeritage(item: Heritage): void {
    if (!this.map) {
      return;
    }
    const coordinates = item.geometry.coordinates;
    this.map.flyTo(latLng(coordinates[1], coordinates[0]));
  }

  onMapReady(map: Map) {
    console.log('map ready');
    this.map = map;
  }

}
