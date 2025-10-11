export type LatLngLiteral = google.maps.LatLngLiteral;
export type RoutePoints = {
  start: LatLngLiteral | null;
  end: LatLngLiteral | null;
}
export interface CreateRouteInputTypes extends RoutePoints {
  routeName: string;
  departureTime: Date | null;
  arrivalTime: Date | null;
}