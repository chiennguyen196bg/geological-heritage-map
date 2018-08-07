import { Icon, icon, Control, DomUtil, Map, LatLng, divIcon } from 'leaflet';
import { heritageTypeConfig } from '../config/heritage-type';
import { Heritage } from '../models/heritage';

export class MyUntil {

    // private static getIconUrl(item: Heritage, type = 'default', _default = 'assets/marker-icon.png') {
    //     for (const config of heritageTypeConfig) {
    //         if (item.type === config.name) {
    //             if (type === 'default') {
    //                 return config.image_url || _default;
    //             }
    //             if (type === 'binding') {
    //                 return config.binding_image_url || _default;
    //             }
    //             if (type === 'marked') {
    //                 return config.marked_image_url || _default;
    //             }
    //         }
    //     }
    //     return _default;
    // }

    // public static createIcon(item: Heritage, type = 'default'): Icon {
        // const iconUrl = this.getIconUrl(item, type);

        // return icon({
        //     iconUrl: iconUrl,
        //     iconSize: [20, 20],
        //     iconAnchor: [10, 10],
        // });
    // }

    public static createDivIcon(item: Heritage, type = 'default') {
        // const iconUrl = this.getIconUrl(item, type);
        let backgroundColor;
        if (item.LoaiDiSan === 'Địa chất') {
            backgroundColor = 'background-yellow';
        } else if (item.LoaiDiSan === 'Văn Hóa') {
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
            for (const config of heritageTypeConfig) {
                div.innerHTML += '<img src="' + config.image_url + '"/> ' + config.name + '<br>';
            }
            return div;
        };
        legend.addTo(map);
    }

    public static isInsideCircle(markerLatLng: LatLng, center: LatLng, radius: number): boolean {
        return markerLatLng.distanceTo(center) <= radius;
    }
}
