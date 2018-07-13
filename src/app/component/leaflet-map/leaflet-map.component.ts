import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, NgZone } from '@angular/core';
// import * as L from 'leaflet';
import { marker, tileLayer, latLng, Map, FeatureGroup, Draw, DrawEvents, Circle, Polygon, Rectangle, geoJSON, PathOptions } from 'leaflet';
import { MyUntil } from '../../utils/my-until';
import { layerConfig } from '../../config/layer-config';
import { HttpClient } from '@angular/common/http';
import { GeoJsonObject } from 'geojson';
import { Heritage } from '../../models/heritage';

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

  private openStreetMapLayer = tileLayer('', { maxZoom: 18, attribution: '...' });
  private customMapLayer = tileLayer('assets/map/Z{z}/{y}/{x}.png', { maxZoom: 18, minZoom: 11, attribution: '...', opacity: 0.3 });

  // config
  leafletOptions = {
    layers: [
      // tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
      // tileLayer('assets/map/Z{z}/{y}/{x}.png', { maxZoom: 18, attribution: '...' })
      // this.openStreetMapLayer,
      this.customMapLayer
    ],
    zoom: 11,
    center: latLng(12.4587489, 107.9188864),
    maxZoom: 17,
    minZoom: 11
  };

  leafletLayersControl = {
    baseLayers: {
      // 'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
      // 'Open Cycle Map': tileLayer('assets/map/Z{z}/{y}/{x}.png', { maxZoom: 18, attribution: '...' })
      'Open Street Map': this.openStreetMapLayer,
      'Custom Map': this.customMapLayer
    },
    overlays: {
    }
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
    private _ngZone: NgZone,
    private http: HttpClient
  ) { }
  // var Esri_WorldImagery = L.;
  ngOnInit() {

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
          console.log('click on marker: ' + item.TT);
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

    // add editable layer to map and create event triggers
    map.addLayer(this.editableLayers);
    MyUntil.createLegend(map);

    map.on(Draw.Event.CREATED, (e: DrawEvents.Created) => {
      this.editableLayers.clearLayers();
      this.emitInsideHeritages(e.layer);
    });
    map.on(Draw.Event.EDITED, (e: DrawEvents.Edited) => {
      this.emitInsideHeritages(e.layers.getLayers()[0]);
    });

    // them overlays on map
    layerConfig.forEach((item) => {
      this.http.get(item.layerUrl).subscribe(data => {
        this.leafletLayersControl.overlays[item.layerName] = geoJSON<any>(data as GeoJsonObject, {
          style: () => item.layerOption
        });
      });
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
