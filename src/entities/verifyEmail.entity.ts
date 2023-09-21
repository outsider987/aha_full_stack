import {Entity, PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn} from 'typeorm';
import {User} from './user.entity';

@Entity('verify_email')
/**
 * VerifyEmail entity.
 * @property {number} id - The ID of the verification email.
 * @property {string} email - The email address to verify.
 * @property {string} verificationToken - The verification token.
 * @property {Date} expirationDate - The expiration date of the token.
 */
export class VerifyEmail {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    email: string;

  @Column({name: 'verification_token'})
    verificationToken: string;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
    createdAt: Date;

  @Column({name: 'expiration_date', type: 'timestamp'})
    expirationDate: Date;

  @Column({name: 'verify_token', type: 'varchar', length: 255, nullable: true})

  @ManyToOne(() => User, (user) => user.verifyEmails)
  @JoinColumn({name: 'user_id'})
    user: User;
}
