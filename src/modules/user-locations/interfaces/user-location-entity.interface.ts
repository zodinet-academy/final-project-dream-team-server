import { Point } from "geojson";

export interface IUserLocationEntity {
  userId?: string;
  latitude?: number;
  longtitude?: number;
  location?: Point;
}
export interface IFriendNearUser {
  friendId: string;
  latitude: number;
  longtitude: number;
  distance: number;
}
export interface IOrigin {
  type: string;
  coordinates: number[];
}
