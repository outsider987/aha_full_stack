import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';


@Entity('login_information')
/**
 * Login entity.
 * @property {number} id - The ID of the login.
 * @property {Date} signUpTimestamp - The timestamp of the sign up.
 * @property {number} loginCount - The number of times the user has logged in.
 * @property {Date} lastSessionTimestamp - The timestamp of the last session.
 */
export class Logins {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    signUpTimestamp: Date;

  @Column({default: 0})
    loginCount: number;

  @Column({type: 'timestamp', nullable: true})
    lastSessionTimestamp: Date;
}
