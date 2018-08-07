import { LatLng, divIcon, Marker, marker, latLng, geoJSON, GeoJSON, PathOptions, Control, Map, DomUtil } from 'leaflet';
import { HERITAGE_TYPE } from '../config/heritage-type';
import { Heritage } from '../models/heritage';
import { GeoJsonObject } from '../../../node_modules/@types/geojson';

export class MyUntil {

    public static createDivIcon(item: Heritage, type = 'default') {
        // const iconUrl = this.getIconUrl(item, type);
        let backgroundColor;
        if (item.LoaiDiSan === HERITAGE_TYPE.DIA_CHAT) {
            backgroundColor = 'background-yellow';
        } else if (item.LoaiDiSan === HERITAGE_TYPE.VAN_HOA) {
            backgroundColor = 'background-white';
        }
        return divIcon({
            html: `<span>${item.TT}</span>`,
            className: 'div-icon ' + backgroundColor,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });

    }

    public static createLegend(map: Map) {
        const legend = new Control({ position: 'bottomleft' });
        legend.onAdd = function (_map: Map) {
            const div = DomUtil.create('div', 'info legend');
            div.innerHTML += `<div class="legend-div background-yellow"></div><span> ${HERITAGE_TYPE.DIA_CHAT}</span><br>`;
            div.innerHTML += `<div class="legend-div background-white"></div><span> ${HERITAGE_TYPE.VAN_HOA}</span><br>`;
            return div;
        };
        legend.addTo(map);
    }

    public static isInsideCircle(markerLatLng: LatLng, center: LatLng, radius: number): boolean {
        return markerLatLng.distanceTo(center) <= radius;
    }

    public static createMarker(item: Heritage, type = 'default'): Marker {
        const coordinates = item.geometry.coordinates;
        return marker(latLng(coordinates[0], coordinates[1]), {
            icon: this.createDivIcon(item, type)
        });
    }

    public static createGeoJsonLayer(item: Heritage): GeoJSON<any> {
        return geoJSON(item.geometry as GeoJsonObject, {
            style: function (): PathOptions {
                return {
                    fillOpacity: 0.8,
                    fillColor: MyUntil.stringToColour(item.TenDiSan),
                };
            }
        });
    }

    public static stringToColour(str: string) {
        str = str ? str + 'ABC' : ' ';
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          // tslint:disable-next-line:no-bitwise
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let colour = '#';
        for (let i = 0; i < 3; i++) {
          // tslint:disable-next-line:no-bitwise
          const value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
      }
}
