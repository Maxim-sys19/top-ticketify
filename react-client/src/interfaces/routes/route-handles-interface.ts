import {Company} from "../../Pages/Admin/Companies/Company";

export type LatLngLiteral = google.maps.LatLngLiteral;
export type RoutePoints = {
  start: LatLngLiteral | null;
  end: LatLngLiteral | null;
}
type TransportsSeats = {
  id: number,
  seatIds: string[] | null
}

interface CompanyTransportSeatsInputType extends Pick<Company, "id"> {
  id: number,
  transports: TransportsSeats[]
}

export interface CreateRouteInputTypes extends RoutePoints {
  routeName: string;
  departureTime: Date | null;
  arrivalTime: Date | null;
  company?: CompanyTransportSeatsInputType,
}