import { InjectRepository } from '@nestjs/typeorm';
import { OutboxRepository } from './outbox.repository';
import { OutboxEntity } from 'src/entities/outbox/infrastructure/outbox.entity';
import { FindManyOptions, In, Repository } from 'typeorm';

export class OutboxRepositoryImpl implements OutboxRepository {
  constructor(
    @InjectRepository(OutboxEntity)
    private readonly repository: Repository<OutboxEntity>,
  ) {}
  async markManyProcessed(ids: number[]): Promise<void> {
    await this.repository.update(
      {
        id: In(ids),
      },
      {
        processed: true,
        processedAt: new Date(),
      },
    );
  }
  async save(outbox: OutboxEntity): Promise<OutboxEntity> {
    return await this.repository.save(outbox);
  }
  async findById(id: string): Promise<any> {
    const orm = await this.repository.findOne({ where: { id: Number(id) } });
    if (!orm) return null;
    return orm;
  }
  async findWithConditions(conditions: FindManyOptions): Promise<any[]> {
    return await this.repository.find(conditions);
  }
}
