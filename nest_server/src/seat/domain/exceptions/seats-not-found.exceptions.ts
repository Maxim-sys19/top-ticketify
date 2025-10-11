export class SeatsNotFoundExceptions extends Error {
  constructor(seatsIds: string[]) {
    super(`Seats not found : ${seatsIds.join(', ')}`,);
    this.name = SeatsNotFoundExceptions.name
  }
}