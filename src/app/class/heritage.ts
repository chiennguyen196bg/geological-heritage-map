export class Heritage {
    // id: number;
    // name: string;
    // localName: string;
    // coordinates: any;
    // district: string;
    // commune: string;
    // village: string;
    // scale: string;
    // areaSize: number;
    id: string;
    name: string;
    type: string;
    lable: string;
    attachedFile: string;
    commune: string;
    district: string;
    geometry: {
        type: string;
        coordinates: [number];
    };
}
