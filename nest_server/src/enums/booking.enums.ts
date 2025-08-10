export enum BookingStatusEnum {
  BOOKED = 'BOOKED', // Забронировано, но ещё не оплачено или не завершено
  CONFIRMED = 'CONFIRMED', // Подтверждено (например, после оплаты)
  CANCELLED = 'CANCELLED', // Отменено пользователем
  REJECTED = 'REJECTED', // Отклонено системой или админом
  COMPLETED = 'COMPLETED', // Завершено (поездка состоялась)
  EXPIRED = 'EXPIRED', // Истекло время ожидания оплаты
  PENDING = 'PENDING', // В ожидании подтверждения
  FAILED = 'FAILED',
}
