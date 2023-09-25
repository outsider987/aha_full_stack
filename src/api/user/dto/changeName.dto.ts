import { IsNotEmpty, IsString } from "class-validator";

/**
 * ChangeName DTO class.
 * @param {string} userName - The user's name.
 */
export class ChangeNameDto {
  @IsString()
  @IsNotEmpty()
  userName: string;
}
