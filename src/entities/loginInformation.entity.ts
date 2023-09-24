import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {User} from './user.entity';

@Entity('login_information')
/**
 * Login entity.
 * @property {number} id - The ID of the login.
 * @property {Date} signUpTimestamp - The timestamp of the sign up.
 * @property {number} loginCount - The number of times the user has logged in.
 * @property {Date} lastSessionTimestamp - The timestamp of the last session.
 */
export class LoginInformation {
  @PrimaryGeneratedColumn()
    id: number;

  // Define the one-to-one relationship with User entity
  @OneToOne(() => User, (user) => user.loginInformation)
  @JoinColumn({name: 'user_id'})
    userId: number;

  @Column({name: 'login_count', default: 0})
    loginCount: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
    createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
    updatedAt: Date;
}
