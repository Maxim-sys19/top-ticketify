import { FindManyOptions } from 'typeorm';

export abstract class BaseRepository<Tentity> {
  abstract save(entity: Tentity): Promise<Tentity>;
  abstract findById(id: string): Promise<Tentity>;
  abstract findWithConditions(conditions: FindManyOptions): Promise<Tentity[]>;
}
