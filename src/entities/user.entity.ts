import {OneToMany, Entity, PrimaryGeneratedColumn,
  Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {RefreshToken} from './refreshTokens.entity';

@Entity('users')
/**
 * User entity.
 * @property {number} id - The ID of the user.
 * @property {string} username - The username of the user.
 * @property {string} email - The email of the user.
 * @property {string} password - The password of the user.
 * @property {Date} createdAt - The date the user was created.
 * @property {Date} updatedAt - The date the user was last updated.
 * @property {string} google_id - The Google ID of the user.
 * @property {string} provider - The provider of the user.
    */
export class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column({type: 'varchar', length: 255, nullable: false})
    userName: string;

  @Column({type: 'varchar', length: 255, nullable: false, unique: true})
    email: string;

  @Column({type: 'varchar', length: 255, nullable: true})

    password: string;

  @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp', default: () =>
      'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

  @Column({nullable: true})
    googleId: string;

  @Column()
    provider: string;

  @OneToMany(() => RefreshToken, (token) => token.userId)
    refreshTokens: RefreshToken[];
}
