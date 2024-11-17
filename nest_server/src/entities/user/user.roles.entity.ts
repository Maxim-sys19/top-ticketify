import { User } from './user.entity';
import { ChildEntity, OneToMany } from 'typeorm';
import { Role } from '../role/role.entity';

@ChildEntity()
export class UserRoles extends User {
  @OneToMany(() => Role, (role) => role.user, { cascade: true })
  roles: Role[];
}
