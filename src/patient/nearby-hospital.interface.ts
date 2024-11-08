export interface NearbyHospital {
    id: number;
    name: string;
    patients: any[];
    requests: any[];
    latitude: number;
    longitude: number;
    dist_meters: number;
}