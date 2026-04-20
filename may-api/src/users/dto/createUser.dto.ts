import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Mat khau phai chua it nhat 1 chu cai in hoa va 1 chu so',
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @Matches(/^0\d{9}$/, {
    message:
      'Phone must start with 0 and have exactly 10 digits (e.g., 0912345678)',
  })
  phone!: string;

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
