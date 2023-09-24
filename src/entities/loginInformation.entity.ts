import {Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn} from 'typeorm';
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

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({name: 'user_id'})
    userId: number;

  @Column({default: 0})
    loginCount: number;

  @Column({type: 'timestamp', nullable: true})
    lastSessionTimestamp: Date;

  @CreateDateColumn({type: 'timestamp'})
    signUpTimestamp: Date;

  @UpdateDateColumn({type: 'timestamp'})
    lastLoginTimestamp: Date;
}
