import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: "Mat khau phai chua it nhat 1 chu cai in hoa va 1 chu so",
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0\d{9}$/, {
    message: 'Số điện thoại không hợp lệ',
  })
  phone: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Role không hợp lệ' })
  role?: UserRole;
}