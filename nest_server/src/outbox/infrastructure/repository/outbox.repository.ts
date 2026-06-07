import { OutboxEntity } from 'src/entities/outbox/infrastructure/outbox.entity';
import { BaseRepository } from 'src/shared/common/repository/base.repository';

export abstract class OutboxRepository extends BaseRepository<OutboxEntity> {
  abstract markManyProcessed(ids: number[]): void;
}
