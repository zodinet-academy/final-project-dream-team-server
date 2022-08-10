import { Point } from "geojson";

export interface IUserLocationEntity {
  userId?: string;
  lat?: number;
  long?: number;
  location?: Point;
}
