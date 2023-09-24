import {OneToMany, Entity, PrimaryGeneratedColumn,
  Column, CreateDateColumn, UpdateDateColumn, OneToOne} from 'typeorm';
import {VerifyEmail} from './verifyEmail.entity';
import {LoginInformation} from './loginInformation.entity';

@Entity('users')
/**
 * User entity.
 * @property {number} id - The ID of the user.
 * @property {string} userName - The username of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {Date} createdAt - The date the user was created.
 * @property {Date} updatedAt - The date the user was last updated.
 * @property {string} googleId - The Google ID of the user.
 * @property {string} provider - The provider of the user.
 * @property {boolean} isEmailConfirmed - Indicates if the email is confirmed.
 * @property {string} resetPasswordToken - The reset password token.
 */
export class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({name: 'user_name', type: 'varchar', length: 255, nullable: false})
    userName: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
    email: string;

  @Column({name: 'password', type: 'varchar', length: 255, nullable: true})
    password: string;

  @Column({name: 'google_id', nullable: true})
    googleId: string;

  @Column({name: 'provider'})
    provider: string;

  @Column({name: 'is_email_confirmed'})
    isEmailConfirmed: boolean;

  @Column({name: 'reset_password_token', nullable: true})
    resetPasswordToken: string;

  @OneToMany(() => VerifyEmail, (verifyEmail) => verifyEmail.user)
    verifyEmails: VerifyEmail[];

  @OneToOne(() => LoginInformation, (loginInformation) => loginInformation)
    loginInformation: LoginInformation;

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
