import { FindManyOptions } from 'typeorm';

export abstract class DomainRepository<ToDomain, ToEntity> {
  abstract save(domain: ToDomain): Promise<ToEntity>;
  abstract findById(id: string): Promise<ToDomain>;
  abstract findWithConditions(conditions: FindManyOptions): Promise<ToDomain[]>;
}
