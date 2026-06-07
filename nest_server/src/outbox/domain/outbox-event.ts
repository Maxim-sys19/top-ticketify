export interface OutboxEvent<TPayload = unknown> {
  id?: number;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  exchange: string;
  routingKey: string;
  processed: boolean;
  createdAt?: Date;
  payload: TPayload;
}
