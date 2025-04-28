import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    //injecting user service
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public login(email: string, password: string, id: number) {
    //check user exists database
    const user = this.usersService.findOneById(id);
    //login
    //token
    return 'Sample_token';
  }

  public isAuth() {
    return true;
  }
}
