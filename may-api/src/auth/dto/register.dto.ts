import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: " Mat khau phai chua it nhat 1 chu cai in hoa va 1 chu so",
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0\d{9}$/, {
    message: "Số điện thoại không hợp lệ",
  })
  phone!: string;

  @IsString()
  @IsOptional()
  address?: string;
}