import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entities/company/company.entity';
import { Repository } from 'typeorm';
import { CompanyUser } from '../entities/user/company.user';
import { Role } from '../entities/role/role.entity';
import { UserRoles } from '../entities/user/user.roles.entity';
import { UserStatus } from '../enums/user.enums';
import { User } from '../entities/user/user.entity';
import { UpdateCompany } from './dto/update-company';
import { hashPwd } from '../helpers/authHelpers';
import { PaginationDto } from '../dto/pagination/pagination.dto';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    @InjectRepository(CompanyUser)
    private readonly companyUserRepository: Repository<CompanyUser>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createCompanyUserDto: CreateCompanyUserDto) {
    try {
      const { name, email, password, company, roles } = createCompanyUserDto;
      const { company_name, company_description } = company;
      const existedUserCompany = await this.companyRepository
        .createQueryBuilder('company')
        .where('company.name = :companyName', {
          companyName: company_name,
        })
        .getOne();
      if (existedUserCompany?.name === company_name) {
        throw new BadRequestException(
          `company : ${existedUserCompany.name} already exists`,
        );
      } else {
        const hashedPwd = await hashPwd(password, 10);
        const role = new Role();
        role.role_name = roles.role_name;
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = hashedPwd;
        user.status = UserStatus.Active;
        const company = new Company();
        company.name = company_name;
        company.description = company_description;
        await this.companyRepository.save(company);
        const data = {
          name: user.name,
          email: user.email,
          password: user.password,
          status: user.status,
          roles: [role],
          company,
        };
        const companyUser = this.companyUserRepository.create(data);
        await this.companyUserRepository.save(companyUser);
        return { status: user.status, company: { name: company_name } };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll({ limit, page }: PaginationDto) {
    const offset = (page - 1) * limit;
    const companies = await this.companyRepository
      .createQueryBuilder('company')
      .leftJoin('company.users', 'user')
      .select([
        'company.id',
        'company.name',
        'company.description',
        'user.id',
        'user.name',
        'user.email',
      ])
      .getMany();
    const paginated = companies.slice(offset, offset + limit);
    return {
      data: paginated,
      meta: {
        totalItems: companies.length,
        totalPages: Math.ceil(companies.length / limit),
      },
    };
  }

  async findOne(id: number) {
    try {
      const company = await this.companyRepository
        .createQueryBuilder('company')
        .select(['company.name', 'company.description'])
        .where('company.id = :id', { id })
        .getOne();
      if (!company) {
        throw new NotFoundException(`Company with id ${id} not found`);
      }
      return company;
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async update(id: number, updateCompanyDto: UpdateCompany) {
    try {
      const { company_name, company_description } = updateCompanyDto;
      const foundCompany = await this.companyRepository
        .createQueryBuilder('company')
        .where('company.id = :id', { id })
        .getOne();
      if (!foundCompany) {
        throw new NotFoundException(`Company with id ${id} not found`);
      }
      foundCompany.name = company_name;
      foundCompany.description = company_description;
      await this.companyRepository.save(foundCompany);
      return { success: true, message: 'company updated' };
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async remove(ids: number[]) {
    try {
      const companiesUser: CompanyUser[] = await this.companyUserRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.company', 'company')
        .leftJoinAndSelect('user.roles', 'role')
        .select(['user.id', 'company.id', 'role.id'])
        .where('company.id IN (:...ids)', { ids })
        .getMany();
      if (companiesUser.length === 0) {
        throw new NotFoundException(`Companies with ids ${ids} not found`);
      }
      for (const companyUser of companiesUser) {
        companyUser.roles.forEach((role) => {
          this.roleRepository.softDelete(role.id);
        });
        await this.companyRepository.softDelete(companyUser.company.id);
        await this.companyUserRepository.softDelete(companyUser.id);
      }
      return {
        success: true,
        message: 'Companies has been deleted successfully',
      };
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async myCompany(userId: number) {
    try {
      const myCompany = await this.companyUserRepository
        .createQueryBuilder('user')
        .innerJoinAndSelect('user.company', 'company')
        .where('user.id = :userId', { userId })
        .select([
          'company.id AS id',
          'company.name AS name',
          'company.description AS description',
        ])
        .getRawOne();
      if (!myCompany) {
        throw new NotFoundException(`Company not found`);
      }
      return myCompany;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
