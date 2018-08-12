import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, NgZone, AfterViewChecked } from '@angular/core';
// import * as L from 'leaflet';
import {
  tileLayer, latLng, Map, FeatureGroup, Draw, DrawEvents,
  Circle, Polygon, Rectangle, geoJSON, Layer, Marker, LatLngBounds, layerGroup, LatLngTuple
} from 'leaflet';
import { MyUntil } from '../../utils/my-until';
import { layerConfig } from '../../config/layer-config';
import { HttpClient } from '@angular/common/http';
import { GeoJsonObject } from 'geojson';
import { Heritage } from '../../models/heritage';
import { HeritageService } from '../../service/heritage.service';
import { isNgTemplate } from '../../../../node_modules/@angular/compiler';
import { HERITAGE_TYPE } from '../../config/heritage-type';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.css']
})
export class LeafletMapComponent implements OnInit, OnChanges, AfterViewChecked {

  @Output() markerClicked = new EventEmitter<Heritage>();
  @Output() drawed = new EventEmitter<Heritage[]>();

  // variable
  editableLayers = new FeatureGroup();
  markers: Marker[] = [];

  geologicalHeritageMarkers: Marker[] = [];
  displayGeologicalHeritageMarkers = true;

  culturalHeritageMarkers: Marker[] = [];
  displayCulturalHeritageMarkers = true;

  biologicalLayers: Layer[] = [];
  displayBiologicalLayers = true;

  map: Map;
  data: Heritage[];

  tourLayers = {};
  displayTours = [];
  tourNames = [];
  public displaySidebar = true;

  private noneMapLayer = tileLayer('', { maxZoom: 16, attribution: '' });
  private customMapLayer = tileLayer('assets/map/Z{z}/{y}/{x}.png', { maxZoom: 16, minZoom: 11, attribution: '', opacity: 0.3 });

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
      'Không nền': this.noneMapLayer,
      'Nền địa chất': this.customMapLayer
    },
    overlays: {
    }
  };

  drawOptions = {
    position: 'bottomleft',
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

  markerClusterOptions = {
    disableClusteringAtZoom: 12
  };

  constructor(
    private _ngZone: NgZone,
    private http: HttpClient,
    private heritageService: HeritageService
  ) { }
  // var Esri_WorldImagery = L.;
  ngOnInit() {
    this.heritageService.getHeritages().subscribe(data => {
      // console.log(data);
      this.data = data;
      // console.log(this.data);
      this.updateData();
    });
    this.getTourData();
  }

  private updateData(): void {
    // console.log(this.data);
    if (this.data) {
      this.geologicalHeritageMarkers = this.data.filter(item => item.LoaiDiSan === HERITAGE_TYPE.DIA_CHAT)
        .map(item => {
          return this.addEventOnClick(MyUntil.createMarker(item), item);
        });

      this.culturalHeritageMarkers = this.data.filter(item => item.LoaiDiSan === HERITAGE_TYPE.VAN_HOA)
        .map(item => {
          return this.addEventOnClick(MyUntil.createMarker(item), item);
        });

      this.biologicalLayers = this.data.filter(item => item.LoaiDiSan === HERITAGE_TYPE.SINH_HOC)
        .map(item => {
          return this.addEventOnClick(MyUntil.createGeoJsonLayer(item), item);
        });
    }

    this.changeDisplayLayer();
  }

  changeDisplayLayer() {
    let _markers: Marker[] = [];
    if (this.displayGeologicalHeritageMarkers) {
      _markers = _markers.concat(this.geologicalHeritageMarkers);
    }
    if (this.displayCulturalHeritageMarkers) {
      _markers = _markers.concat(this.culturalHeritageMarkers);
    }
    this.markers = _markers;
  }

  getTourData() {
    layerConfig.forEach((item) => {
      this.http.get(item.layerUrl).subscribe(data => {
        this.tourLayers[item.layerName] = geoJSON<any>(data as GeoJsonObject, {
          style: () => item.layerOption
        });
        this.tourNames.push(item.layerName);
      });
    });
  }

  private addEventOnClick<T extends Layer>(layer: T, item: Heritage): T {
    return layer.on('click', () => {
      console.log('click on : ' + item.TT);
      this._ngZone.run(() => {
        this.markerClicked.emit(item);
        // this.flyToHeritage(item);
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateData();
  }

  public flyToHeritage(item: Heritage): void {
    if (!this.map) {
      return;
    }
    const coordinates = item.geometry.coordinates;
    if (item.geometry.type === 'Point') {
      this.map.flyTo(latLng(item.geometry.coordinates as LatLngTuple), 13);
    } else {
      // this.map.fitBounds(item.geometry.coordinates as LatLngTuple[]);
    }
  }

  public flyToHeritages(items: Heritage[]): void {
    if (!this.map) {
      return;
    }
    const coordinates: LatLngTuple[] = [];
    for (const item of items) {
      if (item.geometry.type === 'Point') {
        coordinates.push(item.geometry.coordinates as LatLngTuple);
      }
    }
    if (coordinates.length > 0) {
      this.map.flyToBounds(coordinates);
    }
  }

  onMapReady(map: Map) {
    console.log('map ready');
    this.map = map;

    this.map.setMaxBounds(new LatLngBounds(
      latLng(12.780967, 107.4663892), latLng(11.7866852, 108.0986811)
    ));

    // add editable layer to map and create event triggers
    map.addLayer(this.editableLayers);
    // MyUntil.createLegend(map);

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
        return layer.getBounds().contains(coordinates);
      };
    } else if (layer instanceof Circle) {
      filterFunc = (heritage: Heritage): boolean => {
        const coordinates = heritage.geometry.coordinates;
        return MyUntil.isInsideCircle(latLng(coordinates as LatLngTuple), layer.getLatLng(), layer.getRadius());
      };
    }
    this._ngZone.run(() => {
      this.drawed.emit(this.data.filter(item => item.geometry.type === 'Point').filter(filterFunc));
    });
  }

  ngAfterViewChecked(): void {
    this.map.invalidateSize(true);
  }



}
