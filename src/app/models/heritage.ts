import { GeoJsonGeometryTypes } from '../../../node_modules/@types/geojson';

export interface Heritage {
    TT: number;
    TenDiSan: string;
    LoaiDiSan: string;
    KieuDiSan: string;
    HienTrangB: string;
    ThongTinXe: string;
    Huyen: string;
    Xa: string;
    KhaNangTiepCanMuaKho: string;
    KhaNangTiepCanMuaMua: string;
    Link: string;
    geometry: {
        type: GeoJsonGeometryTypes;
        coordinates: [number, number]
    };
}
