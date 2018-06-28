export class Heritage {
    id: number;
    name: string;
    type: string;
    label: string;
    attachedFile: string;
    commune: string;
    district: string;
    geometry: {
        type: string;
        coordinates: [number];
    };
}
