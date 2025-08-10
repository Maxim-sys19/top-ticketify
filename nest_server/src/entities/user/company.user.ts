import { ChildEntity, ManyToOne } from 'typeorm';
import { Company } from '../company/company.entity';
import { UserRoles } from './user.roles.entity';

@ChildEntity()
export class CompanyUser extends UserRoles {
  @ManyToOne(() => Company, (company) => company.users, { onDelete: 'CASCADE' })
  company: Company;
}
