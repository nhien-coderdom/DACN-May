import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/createUser.dto.js';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUserProfile.dto.js';
// import { UpdateLoyaltyDto } from './dto/updateLoyalty.dto.js';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UpdateUserRoleDto } from './dto/updateUserRole.dto.js';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.usersService.findAll();
    }


    @Get('me') //cho phép người dùng xem thông tin của chính họ mà không cần phải biết id
    @UseGuards(AuthGuard('jwt'))
    getMyProfile(@Req() req) {
        return this.usersService.getMyProfile(req.user.id);
    }


    @Get(':id') // admin có thể xem thông tin của bất kỳ người dùng nào, nhưng người dùng chỉ có thể xem thông tin của chính họ
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Param('id') id: string, @Req() req: any) {
        if (req.user.id !== Number(id) && req.user.role !== UserRole.ADMIN) {
            throw new ForbiddenException();
        }
        return this.usersService.getProfile(Number(id));
    }


    @Post() // Chỉ admin mới có quyền tạo người dùng mới
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }


    @Patch('/me/update') // Cho phép người dùng cập nhật thông tin của chính họ mà không cần phải biết id
    @UseGuards(AuthGuard('jwt'))
    updateProfile(
        @Req() req,
        @Body() dto: UpdateUserDto
    ) {
        return this.usersService.updateProfile(
            req.user.id,
            dto
        );
    }


    @Delete(':id') // Chỉ admin mới có quyền xóa người dùng, và chỉ xóa mềm (soft delete)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    deleteProfile(@Param('id') id: string) {
        return this.usersService.deleteProfile(Number(id));
    }


    @Patch(':id/restore') // Chỉ admin mới có quyền khôi phục người dùng đã bị xóa mềm
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    restoreProfile(@Param('id') id: string) {
        return this.usersService.restoreProfile(Number(id));
    }


    @Get(':id/loyalty') 
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.STAFF)
    getLoyaltyInfo(@Req() req, @Param('id') id: string) {

        if (req.user.id !== Number(id) && ![UserRole.ADMIN, UserRole.STAFF].includes(req.user.role)) {
        throw new ForbiddenException();
    }
        return this.usersService.getLoyaltyInfo(Number(id));
    }


    // @Post(':id/loyalty/update-from-order')
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Roles(UserRole.ADMIN, UserRole.STAFF)
    // updateLoyaltyFromOrder(
    //     @Param('id') id: string,
    //     @Body() dto: UpdateLoyaltyDto
    // ) {
    //     return this.usersService.updateLoyaltyFromOrder(
    //         Number(id),
    //         dto.orderAmount
    //     );
    // }

    @UseGuards(AuthGuard('jwt'))
    @Patch('me/loyalty/use')
    useLoyaltyPoints(
        @Req() req,
        @Param('id') id: string,
        @Body('points') points: number
    ) {
        return this.usersService.useLoyaltyPoints(
            req.user.id, // ❗ không dùng id từ param
            points
        );
    }


    @Patch(':id/role')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    updateUserRole(
        @Param('id') id: string,
        @Body() dto: UpdateUserRoleDto
    ) {
        return this.usersService.updateUserRole(Number(id), dto.role);
    }


}