import { IsNumber, Min } from 'class-validator';

export class UpdateLoyaltyDto {

  @IsNumber()
  @Min(0)
  orderAmount: number;
}