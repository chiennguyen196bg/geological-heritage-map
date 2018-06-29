import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, NgZone } from '@angular/core';
// import * as L from 'leaflet';
import { Heritage } from '../../class/heritage';
import { marker, tileLayer, latLng, Map, FeatureGroup, Draw, DrawEvents, Circle, Polygon, Rectangle } from 'leaflet';
import { MyUntil } from '../../utils/my-until';

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
  @Output() drawed = new EventEmitter<Heritage[]>();

  // variable
  editableLayers = new FeatureGroup();
  markers: any[] = [];
  map: Map;

  // config
  leafletOptions = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 10,
    center: latLng(12.4587489, 107.9188864)
  };
  drawOptions = {
    position: 'topright',
    draw: {
      marker: false,
      polyline: false,
      circle: {
        shapeOptions: {
          color: '#aaaaaa'
        }
      },
      circlemarker: false
    },
    edit: {
      featureGroup: this.editableLayers,
      // remove: false
    }
  };

  constructor(
    private _ngZone: NgZone
  ) { }
  // var Esri_WorldImagery = L.;
  ngOnInit() {
    console.log('On init');
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Onchanges');
    // console.log(this.data);
    if (this.data) {
      this.markers = this.data.map(item => {
        const coordinates = item.geometry.coordinates;
        let type = 'default';
        if (this.bindingPoints && this.bindingPoints.indexOf(item) > -1) {
          type = 'binding';
        } else if (this.markedPoints && this.markedPoints.indexOf(item) > -1) {
          type = 'marked';
        }
        // console.log('type: ' + type);
        return marker(latLng(coordinates[0], coordinates[1]), {
          icon: MyUntil.createDivIcon(item, type)
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
    this.map.flyTo(latLng(coordinates[0], coordinates[1]), 15);
  }

  onMapReady(map: Map) {
    console.log('map ready');
    this.map = map;
    map.addLayer(this.editableLayers);
    MyUntil.createLegend(map);

    map.on(Draw.Event.CREATED, (e: DrawEvents.Created) => {
      this.editableLayers.clearLayers();
      this.emitInsideHeritages(e.layer);
    });
    map.on(Draw.Event.EDITED, (e: DrawEvents.Edited) => {
      this.emitInsideHeritages(e.layers.getLayers()[0]);
    });
  }

  private emitInsideHeritages(layer) {
    console.log(layer);
    let filterFunc = (heritage: Heritage): boolean => false;
    if (layer instanceof Polygon || layer instanceof Rectangle) {
      filterFunc = (heritage: Heritage): boolean => {
        const coordinates = heritage.geometry.coordinates;
        return layer.getBounds().contains(latLng(coordinates[0], coordinates[1]));
      };
    } else if (layer instanceof Circle) {
      filterFunc = (heritage: Heritage): boolean => {
        const coordinates = heritage.geometry.coordinates;
        return MyUntil.isInsideCircle(latLng(coordinates[0], coordinates[1]), layer.getLatLng(), layer.getRadius());
      };
    }
    this._ngZone.run(() => {
      this.drawed.emit(this.data.filter(filterFunc));
    });
  }


}
