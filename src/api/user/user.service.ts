import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { ChangeNameDto } from './dto/changeName.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
/**
 * UserService
 */
export class UserService {
  /**
   * UserService constructor.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * changeName endpoint
   * @param {LoginDto} dto - The login DTO.
   * @param {string} email - The user's email.
   */
  async modifiName(dto: ChangeNameDto, email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    const oldName = user.userName;
    user.userName = dto.userName;
    await this.userRepository.save(user);
    return { oldName, newName: user.userName };
  }

  /**
   * getUsersDashboard endpoint
   */
  async getUsersDashboard() {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'userName'],
      relations: { loginInformation: true }
    });
    return users;
  }

  /**
   * getStatistics endpoint
   */
  async getStatistics() {
    const users = await this.userRepository.find({
      select: ['id', 'email', 'userName'],
      relations: { loginInformation: true }
    });

    const usersSignedUp = users.length;
    const usersTodayActive = users.filter((user) => {
      const lastLogin = user.loginInformation.updatedAt;
      const today = new Date();
      const yesterday = new Date(today.setDate(today.getDate() - 1));
      return lastLogin > yesterday;
    }).length;

    const usersThisWeekActive = users.filter((user) => {
      const lastLogin = user.loginInformation.updatedAt;
      const today = new Date();
      const lastWeek = new Date(today.setDate(today.getDate() - 7));
      return lastLogin > lastWeek;
    }).length;

    return { usersSignedUp, usersTodayActive, usersThisWeekActive };
  }
}
