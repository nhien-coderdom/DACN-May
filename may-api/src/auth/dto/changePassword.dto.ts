import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator"

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @MinLength(6)
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
        message: "Password must contain at least 1 uppercase letter and 1 number",
    })
  newPassword: string;
}