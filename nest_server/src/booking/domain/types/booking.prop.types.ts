export interface BookingPropTypes {
  userId: string;
  routeId: string;
  companyId: string;
  transportId: string;
  seatIds: string[];
  bookingTime: string | Date;
  // userName?: string;
  // userEmail?: string;
}
