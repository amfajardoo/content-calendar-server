import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async getAllProfiles(): Promise<User[]> {
		return this.usersService.profiles({});
	}

	@Get(':id')
	async getProfileById(@Param('id') id: string): Promise<User | null> {
		return this.usersService.profile({ id });
	}

	@Put(':id')
	async updateUser(
		@Param('id') id: string,
		@Body() userData: { email?: string; name?: string },
	): Promise<User> {
		const { email, name } = userData;
		return this.usersService.updateUser({
			where: { id },
			data: {
				...(email && { email }),
				...(name && { name }),
			},
		});
	}

	@Delete(':id')
	async deleteUser(@Param('id') id: string): Promise<User | null> {
		return this.usersService.deleteUser({ id });
	}
}
