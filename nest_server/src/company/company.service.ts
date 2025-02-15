import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {CreateCompanyUserDto} from './dto/create-company-user.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Company} from '../entities/company/company.entity';
import {Repository} from 'typeorm';
import {CompanyUser} from '../entities/user/company.user';
import {Role} from '../entities/role/role.entity';
import {UserRoles} from '../entities/user/user.roles.entity';
import {UserStatus} from '../enums/user.enums';
import {User} from '../entities/user/user.entity';
import {UpdateCompany} from './dto/update-company';
import {hashPwd} from '../helpers/authHelpers';
import {PaginationParams} from '../decorators/pagination';
import {CompanyTransports} from 'src/entities/company/company.transports';
import {TransportSeats} from 'src/entities/transport/transport.seats';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    @InjectRepository(CompanyUser)
    private readonly companyUserRepository: Repository<CompanyUser>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyTransports)
    private readonly companyTransportsRepository: Repository<CompanyTransports>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(TransportSeats)
    private readonly transportSeatsRepository: Repository<TransportSeats>,
  ) {
  }

  async create(createCompanyUserDto: CreateCompanyUserDto) {
    try {
      const {name, email, password, company, roles} = createCompanyUserDto;
      const {company_name, company_description} = company;
      const existedCompany = await this.companyRepository
        .createQueryBuilder()
        .where('name = :companyName', {
          companyName: company_name,
        })
        .getOne();
      if (existedCompany?.name === company_name) {
        throw new BadRequestException(
          `company : ${existedCompany.name} already exists`,
        );
      } else {
        const hashedPwd = await hashPwd(password, 10);
        const role = new Role();
        role.role_name = roles.role_name;
        const company = new Company();
        company.name = company_name;
        company.description = company_description;
        await this.companyRepository.save(company);
        const user = this.companyUserRepository.create({
          name,
          email,
          password: hashedPwd,
          status: UserStatus.Active,
          company: company,
          roles: [role]
        })
        // const data = {
        //   name: name,
        //   email: email,
        //   password: hashedPwd,
        //   status: UserStatus.Active,
        //   company,
        //   role: [role],
        // };
        // const companyUser = this.companyUserRepository.create(data);
        // console.log(companyUser)
        await this.companyUserRepository.save(user);
        return {status: user.status, company: {name: company_name}};
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(params: PaginationParams) {
    const {limit = 0, page = 1}: PaginationParams = params;
    const companies = this.companyRepository
      .createQueryBuilder('company')
      .leftJoin('company.users', 'user')
      .select([
        'company.id',
        'company.name',
        'company.description',
        'user.id',
        'user.name',
        'user.email',
      ]);
    companies.skip((page - 1) * limit).take(+limit);
    const [data, total] = await companies.getManyAndCount();

    return {
      data,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    try {
      const company = await this.companyRepository
        .createQueryBuilder('company')
        .select(['company.name', 'company.description'])
        .where('company.id = :id', {id})
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
      const {company_name, company_description} = updateCompanyDto;
      const foundCompany = await this.companyRepository
        .createQueryBuilder('company')
        .where('company.id = :id', {id})
        .getOne();
      if (!foundCompany) {
        throw new NotFoundException(`Company with id ${id} not found`);
      }
      foundCompany.name = company_name;
      foundCompany.description = company_description;
      await this.companyRepository.save(foundCompany);
      return {success: true, message: 'company updated'};
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
        .where('company.id IN (:...ids)', {ids})
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
        .leftJoinAndSelect('user.company', 'company')
        .where('user.id = :userId', {userId})
        .select(["company.id as id", "company.name as name", "company.description as descrition"])
        .getRawOne();
      const transports = await this.transportSeatsRepository
        .createQueryBuilder('transports')
        .where(`transports.companyId = ${myCompany.id}`)
        .select([
          'transports.id as id',
          'transports.name as name',
          'transports.description as descrition',
          'transports.isActive as isActive',
          'transports.capacity as capacity',
        ])
        .execute();
      if (!myCompany) {
        throw new NotFoundException(`Company not found`);
      }
      return {myCompany, transports};
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
