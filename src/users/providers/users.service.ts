import {
  Injectable,
  Inject,
  forwardRef,
  RequestTimeoutException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GetUsersParamDto } from '../DTOs/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDTO } from '../DTOs/create-users.dto';
import { ConfigService, ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDTO } from '../DTOs/create-many-users.dto';

/**
 * Class to connect Users table and perform business operations
 */
@Injectable()
export class UsersService {
  /**
   * The method to get all the users from the database
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /**
     * Injecting config service to get the environment variables
     */
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
    /**
     * Inject CreateManyProvider
     */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDTO) {
    let existingUser: User | null = null;
    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      //Might save the deatails of the exception
      //Information which is sensitive
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        {
          description: 'Error while checking for existing user',
        },
      );
    }

    //check is user exists with same email

    //handle exception
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    //create new user
    let newUser = this.usersRepository.create(createUserDto);
    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        {
          description: 'Error while creating new user',
        },
      );
    }
    return newUser;
  }

  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'This endpoint is not implemented yet',
        fileName: 'users.service.ts',
        lineMumber: 88,
      },
      HttpStatus.MOVED_PERMANENTLY,
      {
        cause: new Error(),
        description: 'This endpoint is not implemented yet',
      },
    );
  }

  public async findOneById(id: number) {
    let user: User | null = null;
    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment',
        {
          description: 'Error while creating new user',
        },
      );
    }
    /**
     * Handle user doesnt exists exception
     */
    if (!user) {
      throw new BadRequestException('User with this id does not exist');
    }
    return user;
  }

  /**
   * Transaction Module Video Codes Starts from here
   */
  public async createMany(createManyUsersDto: CreateManyUsersDTO) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }
}
