import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsCar from '@mui/icons-material/DirectionsCar';
import DirectionsRailwayIcon from '@mui/icons-material/DirectionsRailway';
import SubwayIcon from '@mui/icons-material/Subway';
import TrainIcon from '@mui/icons-material/Train';
import TramIcon from '@mui/icons-material/Tram';
import type { Station } from './StationSearch';

export interface Products {
    express?: boolean;
    nationalExpress?: boolean;
    national?: boolean;
    regionalExpress?: boolean;
    regional?: boolean;
    suburban?: boolean;
    subway?: boolean;
    tram?: boolean;
    bus?: boolean;
    ferry?: boolean;
    expressTrain?: boolean;
    nationalTrain?: boolean;
    localTrain?: boolean;
    watercraft?: boolean;
    dialARide?: boolean;
}

export const defaultProducts: Products = {
    express: true,
    nationalExpress: true,
    national: true,
    regionalExpress: true,
    regional: true,
    suburban: true,
    subway: true,
    tram: true,
    bus: true,
    ferry: true,
    expressTrain: true,
    nationalTrain: true,
    localTrain: true,
    watercraft: true,
    dialARide: true,
};

export const productConfig = [
    { key: 'express', label: 'ice_ic_ec', icon: DirectionsRailwayIcon, color: '#EC0016' },
    { key: 'nationalExpress', label: 'ice', icon: TrainIcon, color: '#FF6F00' },
    { key: 'national', label: 'ic_ec', icon: TrainIcon, color: '#FF8F00' },
    { key: 'regionalExpress', label: 're', icon: TrainIcon, color: '#709EBF' },
    { key: 'regional', label: 're_rb', icon: TrainIcon, color: '#1455C0' },
    { key: 'suburban', label: 's_bahn', icon: TrainIcon, color: '#008D4F' },
    { key: 'subway', label: 'u_bahn', icon: SubwayIcon, color: '#0065AE' },
    { key: 'tram', label: 'tram', icon: TramIcon, color: '#D5001C' },
    { key: 'bus', label: 'bus', icon: DirectionsBusIcon, color: '#A5027D' },
    { key: 'ferry', label: 'ferry', icon: DirectionsBoatIcon, color: '#0080C8' },
    { key: 'expressTrain', label: 'ice', icon: DirectionsRailwayIcon, color: '#EC0016' },
    { key: 'nationalTrain', label: 'ic_ec_cnl_ir', icon: TrainIcon, color: '#FF6F00' },
    { key: 'localTrain', label: 'nahv.', icon: TrainIcon, color: '#1455C0' },
    { key: 'watercraft', label: 'boat', icon: DirectionsBoatIcon, color: '#0080C8' },
    { key: 'dialARide', label: 'ast', icon: DirectionsCar, color: '#0080C8' },
] as const;

/** Mapping von HAFAS-Produktnamen (mit Bindestrichen) zu camelCase-Keys */
const HAFAS_PRODUCT_KEY_MAPPING: Record<string, string> = {
    'dial-a-ride': 'dialARide',
    'express-train': 'expressTrain',
    'national-train': 'nationalTrain',
    'local-train': 'localTrain',
};

/**
 * Konvertiert HAFAS-Produktobjekt: Schlüssel mit Bindestrichen werden zu camelCase umgewandelt
 * und es wird ein neues Objekt zurückgegeben, das mit Station['products'] kompatibel ist.
 *
 * @param products - Das ursprüngliche Produktobjekt mit möglichen Bindestrich-Schlüsseln
 * @returns Ein neues Produktobjekt mit camelCase-Schlüsseln, das mit Station['products'] kompatibel ist
 */
export const normalizeProducts = (products?: Record<string, boolean>): Station['products'] | undefined => {
    if (!products) {
        return undefined;
    }
    const normalized: Record<string, boolean> = {};
    Object.entries(products).forEach(([key, value]) => {
        const mappedKey = HAFAS_PRODUCT_KEY_MAPPING[key] ?? key;
        normalized[mappedKey] = value;
    });
    return normalized as Station['products'];
};
