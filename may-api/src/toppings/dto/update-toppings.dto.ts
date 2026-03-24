import { IsString, IsNumber, IsOptional } from 'class-validator'

export class UpdateToppingDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsNumber()
  price?: number
}