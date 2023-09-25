import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { ChangeNameDto } from "./dto/changeName.dto";
import { Injectable } from "@nestjs/common";

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
    private readonly userRepository: Repository<User>,
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
}
