export type LatLngLiteral = google.maps.LatLngLiteral;
export type RoutePoints = {
  start: LatLngLiteral | null;
  end: LatLngLiteral | null;
}
export interface RoutesInputTypes extends RoutePoints {
  routeName: string;
  departureTime: Date | null;
  arrivalTime: Date | null;
}