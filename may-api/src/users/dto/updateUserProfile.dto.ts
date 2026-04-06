import { IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Matches(/^0?\d{9,10}$/, {
    message: 'Phone must be 9-10 digits (with or without leading 0, e.g., 0912345678 or 912345678)',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  address?: string;
}