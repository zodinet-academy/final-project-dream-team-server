import { Point } from "geojson";

export interface IUserLocationEntity {
  userId?: string;
  latitude?: number;
  longtitude?: number;
  location?: Point;
}
export interface IFriendNearUser {
  friendId: string;
  friendName: string;
  friendBirthday: Date;
  friendAvatar: string;
  latitude: number;
  longtitude: number;
  distance: number;
  unit: string;
}
export interface IOrigin {
  type: string;
  coordinates: number[];
}
