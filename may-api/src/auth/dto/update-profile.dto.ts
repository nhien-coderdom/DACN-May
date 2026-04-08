import { IsOptional, IsString, Matches, Length } from 'class-validator'

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string

  @IsOptional()
  @IsString()
  @Matches(/^0\d{9}$/, {
    message: 'Phone must be valid (10 digits starting with 0)'
  })
  phone?: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  address?: string
}
