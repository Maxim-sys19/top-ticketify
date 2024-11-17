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
import { plainToClass } from 'class-transformer';
import { id } from 'date-fns/locale';

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
        const savedCompanyUser =
          await this.companyUserRepository.save(companyUser);
        return plainToClass(CompanyUser, savedCompanyUser);
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findAll() {
    return this.companyRepository.createQueryBuilder('company').getMany();
  }

  async findOne(id: number) {
    try {
      const company = await this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.users', 'user')
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
      return await this.companyRepository.save(foundCompany);
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async remove(id: number) {
    try {
      const userCompany = await this.companyUserRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.company', 'company')
        .leftJoinAndSelect('user.roles', 'role')
        .where('company.id = :id', { id })
        .getOne();
      if (!userCompany) {
        throw new NotFoundException(`Company with id ${id} not found`);
      }
      userCompany.roles.map(async (role) => {
        await this.roleRepository.softDelete(role.id);
      });
      await this.companyRepository.softDelete(userCompany.company.id);
      return this.companyUserRepository
        .softDelete(userCompany.id)
        .then((result) => {
          if (result.affected === 1) {
            return { success: true, message: 'Deleted!' };
          }
        });
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
