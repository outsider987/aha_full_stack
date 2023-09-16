import {Entity, PrimaryGeneratedColumn,
  Column, ManyToOne, JoinColumn} from 'typeorm';
import {User} from './user.entity'; // Assuming you have a User entity

@Entity('oauth_tokens')
/**
 * OAuthToken entity.
 * @property {number} token_id - The ID of the token.
 * @property {User} user - The user the token belongs to.
 * @property {string} token_value - The value of the token.
 * @property {Date} expiration - The expiration date of the token.
 */
export class OAuthToken {
  @PrimaryGeneratedColumn()
    token_id: number;

  @ManyToOne(() => User, (user) => user.oauthTokens)
  @JoinColumn({name: 'user_id'})
    user: User;

  @Column()
    token_value: string;

  @Column({type: 'timestamp'})
    expiration: Date;

  // Add other token-related fields as needed
}
