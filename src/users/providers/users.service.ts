import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { GetUsersParamDto } from '../DTOs/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDTO } from '../DTOs/create-users.dto';

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
  ) {}

  public async createUser(createUserDto: CreateUserDTO) {
    //check is user exists with same email

    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    //handle exception

    //create new user
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);
    return newUser;
  }

  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    return [
      {
        firstName: 'john',
        email: 'john@doe.com',
      },
      {
        firstName: 'kola',
        email: 'kola@doe.com',
      },
    ];
  }

  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({
      id,
    });
  }
}
