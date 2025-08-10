import {
  BeforeInsert,
  BaseEntity as TypeOrmBaseEntity,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

export abstract class BaseEntityWithID extends TypeOrmBaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string;
  @BeforeInsert()
  async generateId() {
    if (!this.id) {
      console.log('before generate id : -', this.id);
      this.id = uuidv4();
      console.log('after generate id :', this.id);
    }
  }
}
