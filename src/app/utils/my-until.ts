import { Icon, icon, Control, DomUtil, Map, LatLng, divIcon } from 'leaflet';
import { Heritage } from '../class/heritage';
import { heritageTypeConfig } from '../config/heritage-type';

export class MyUntil {

    private static getIconUrl(item: Heritage, type = null, _default = 'assets/marker-icon.png') {
        for (const config of heritageTypeConfig) {
            if (item.type === config.name) {
                return config.image_url;
            }
        }
        return _default;
    }

    public static createIcon(item: Heritage, type = 'default'): Icon {
        let iconUrl = this.getIconUrl(item, type);
        switch (type) {
            case 'marked': iconUrl = 'assets/images/icons8-ghost-48.png'; break;
            case 'binding': iconUrl = 'assets/images/pineapple.png'; break;
        }
        return icon({
            iconUrl: iconUrl,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });
    }

    public static createDivIcon(item: Heritage, type = 'default') {
        let iconUrl = this.getIconUrl(item, type);
        switch (type) {
            case 'marked': iconUrl = 'assets/images/icons8-ghost-48.png'; break;
            case 'binding': iconUrl = 'assets/images/pineapple.png'; break;
        }
        return divIcon({
            html: '<img src="' + iconUrl + '"/> ' + item.label,
            className: 'div-icon',
            iconSize: [25, 25],
            iconAnchor: [13, 13],
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
