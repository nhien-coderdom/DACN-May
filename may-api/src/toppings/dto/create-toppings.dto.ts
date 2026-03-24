//Validate input
// kiểm tra dữ liệu gửi lên có hợp lệ không
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateToppingDto {
    @IsString()
    name: string;

    @IsNumber()
    price: number;
}