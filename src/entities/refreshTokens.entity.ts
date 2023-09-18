import {
  Entity, PrimaryGeneratedColumn,
  Column, ManyToOne, JoinColumn,
} from 'typeorm';
import {User} from './user.entity';


  @Entity('refresh_tokens')
  /**
  * OAuthToken entity.
  * @property {number} token_id - The ID of the token.
  * @property {User} userId - The user ID of the token.
  * @property {string} refreshToken - The token.
  * @property {Date} expiration - The expiration date of the token.
  */
export class RefreshToken {
  @PrimaryGeneratedColumn()
    token_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({name: 'user_id'})
    userId: User;


  @Column({type: 'timestamp'})
    expiration: Date;

  @Column()
    refreshToken: string;
}

