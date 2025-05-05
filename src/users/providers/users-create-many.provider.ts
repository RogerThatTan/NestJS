import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUsersDTO } from '../DTOs/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /**
     * Inject Data Source
     */
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Transaction Module Video Codes Starts from here
   */
  public async createMany(createManyUsersDto: CreateManyUsersDTO) {
    let newUsers: User[] = [];
    // Create  a query runner Instance
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      //Connect query runner to the database
      await queryRunner.connect();
      //Start transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException("Couldn't connect to the database");
    }

    try {
      for (let user of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      //if success commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      //if error rollback the transaction (intial stage before starting the transaction)
      await queryRunner.rollbackTransaction();
      throw new ConflictException("Couldn't complete the transaction", {
        description: String(error),
      });
    } finally {
      try {
        //Release the connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException("Couldn't release the connection", {
          description: String(error),
        });
      }
    }
    return newUsers;
  }
}
