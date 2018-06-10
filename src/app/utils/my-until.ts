import { IconOptions, Icon, icon, Control, DomUtil, Map, LatLng, LatLngBoundsExpression, LatLngBounds } from 'leaflet';
import { Heritage } from '../class/heritage';
import { heritageTypeConfig } from '../config/heritage-type';

export class MyUntil {
    public static createIcon(item: Heritage, type = 'default'): Icon {
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
