import { Point } from "geojson";

export interface IUserLocationEntity {
  userId?: string;
  latitude?: number;
  longtitude?: number;
  location?: Point;
}
export interface IFriendNearUser {
  id: string;
  name: string;
  birthday: Date;
  avatar: string;
  latitude: number;
  longtitude: number;
  distance: number;
  unit: string;
}
export interface IOrigin {
  type: string;
  coordinates: number[];
}
