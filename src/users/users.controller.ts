import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Req,
  Headers,
  Ip,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from '@nestjs/common';
import { CreateUserDTO } from './DTOs/create-users.dto';
import { GetUsersParamDto } from './DTOs/get-users-param.dto';
import { PatchUserDTO } from './DTOs/patch-users.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    //Injecting Users Service
    private readonly usersService: UsersService,
  ) {}

  /**
   * Final Endpoint - /users/id?limit=10&page=1
   * Parama id - optional, convert to integer, cannot have a default value
   * Query limit - integer, default 10
   * Query page - integer, default value 1
   * ==> USE CASES
   * /users/ -> return all users with default pagination
   * /users/1223 -> returns one user whos id is 1234
   * /users?limit=10&page=2 -> return page 2 with limt of pagination 10
   */

  @Get('/:id')
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully by the query ',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries returned per query ',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description:
      'The position of the page number that you want the API to return',
    example: 1,
  })
  // public getUsers(@Param() params: any, @Query() query: any) {
  //   console.log(params);
  //   console.log(query);
  //   return 'You sent a request to users endpoint';
  // }
  public getUsers(
    @Param() getUserParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUserParamDto, limit, page);
  }

  //only id and limit will show in the console
  // public getUsers(
  //   @Param('id', ParseIntPipe) id: number | undefined,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  // ) {
  //   // console.log(typeof id);
  //   // console.log(id);
  //   console.log(typeof limit);
  //   console.log(limit);
  //   console.log(typeof page);
  //   console.log(page);
  //   return 'You sent a request to users endpoint';
  // }

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.createUser(createUserDto);
  }

  //only email will show
  // public createUsers(@Body('email') email: any) {
  //   console.log(email);
  //   return 'You sent a post request to users endpoint';
  // }

  //need for express js for more object values
  // public createUsers(@Req() request: Request) {
  //   console.log(request);
  //   return 'You sent a post request to users endpoint';
  // }

  @Patch()
  public patchUser(@Body() patchUserDto: PatchUserDTO) {
    return patchUserDto;
  }
}
