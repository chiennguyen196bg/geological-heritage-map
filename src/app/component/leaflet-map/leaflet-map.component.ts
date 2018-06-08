import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, NgZone } from '@angular/core';
// import * as L from 'leaflet';
import { Heritage } from '../../class/heritage';
import { marker, tileLayer, latLng, icon, Map, IconOptions, Icon, Control, DomUtil } from 'leaflet';
import { heritageTypeConfig } from '../../config/heritage-type';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit, OnChanges {

  @Input() data: Heritage[];
  @Input() markedPoints: Heritage[] = [];
  @Input() bindingPoints: Heritage[] = [];
  @Output() markerClicked = new EventEmitter<Heritage>();


  options: any;
  layers: any[];
  map: Map;

  private static createIcon(item: Heritage, type = 'default'): Icon {
    let iconOptions: IconOptions;
    let iconUrl = 'assets/marker-icon.png';
    for (const config of heritageTypeConfig) {
      if (item.type === config.name) {
        iconUrl = config.image_url;
        break;
      }
    }
    iconOptions = {
      iconUrl: iconUrl,
      iconSize: [25, 25],
      iconAnchor: [13, 25],
    };
    switch (type) {
      case 'marked': iconOptions.iconUrl = 'assets/images/icons8-ghost-48.png'; break;
      case 'binding': iconOptions.iconUrl = 'assets/images/pineapple.png'; break;
      // default: iconOptions.iconUrl = 'assets/marker-icon.png'; break;
    }
    return icon(iconOptions);
  }

  private static createLegend(map: Map) {
    const legend = new Control({ position: 'bottomleft' });
    legend.onAdd = function (_map: Map) {
      const div = DomUtil.create('div', 'info legend');
      for (const config of heritageTypeConfig) {
        div.innerHTML += '<img src="' + config.image_url + '"/> ' + config.name + '<br>';
      }
      return div;
    };
    legend.addTo(map);
  }


  constructor(
    private _ngZone: NgZone
  ) { }
  // var Esri_WorldImagery = L.;
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
        let type = null;
        if (this.bindingPoints && this.bindingPoints.indexOf(item) > -1) {
          type = 'binding';
        } else if (this.markedPoints && this.markedPoints.indexOf(item) > -1) {
          type = 'marked';
        }
        // console.log('type: ' + type);
        return marker(latLng(coordinates[1], coordinates[0]), {
          icon: LeafletMapComponent.createIcon(item, type)
        }).on('click', () => {
          console.log('click on marker: ' + item.id);
          this._ngZone.run(() => {
            this.markerClicked.emit(item);
            // this.flyToHeritage(item);
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
    this.map.flyTo(latLng(coordinates[1], coordinates[0]), 15);
  }

  onMapReady(map: Map) {
    console.log('map ready');
    this.map = map;
    LeafletMapComponent.createLegend(map);
  }



}
