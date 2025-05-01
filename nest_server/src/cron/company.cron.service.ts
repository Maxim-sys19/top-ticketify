import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company/company.entity';
import { CompanyUser } from 'src/entities/user/company.user';
import { Repository } from 'typeorm';
import { CompanyTransports } from '../entities/company/company.transports';

@Injectable()
export class CompanyCronService {
  constructor(
    @InjectRepository(CompanyUser)
    private readonly companyUserRepository: Repository<CompanyUser>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyTransports)
    private readonly companyTransportsRepository: Repository<CompanyTransports>,
  ) {}

  async deleteAllCompanies() {
    const softDeletedCompany = await this.companyTransportsRepository
      .createQueryBuilder()
      .withDeleted()
      .where('deletedAt IS NOT NULL')
      .getMany();
    console.log(softDeletedCompany);
    if (softDeletedCompany.length === 0) {
      console.log(`No companies found.`);
    } else {
      await this.companyTransportsRepository
        .remove(softDeletedCompany)
        .then((res) => console.log('All companies deleted: ', res))
        .catch((err) => console.log('delete error: ', err));
    }
  }
}
