import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	async createUser(
		@Body() userData: { email: string; name: string },
	): Promise<UserModel> {
		const { email, name } = userData;
		return this.usersService.createUser({
			email,
			name,
		});
	}

	@Get()
	async getAllUsers(): Promise<UserModel[]> {
		return this.usersService.users({});
	}

	@Get(':id')
	async getUserById(@Param('id') id: string): Promise<UserModel | null> {
		return this.usersService.user({ id });
	}

	@Put(':id')
	async updateUser(
		@Param('id') id: string,
		@Body() userData: { email?: string; name?: string },
	): Promise<UserModel> {
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
	async deleteUser(@Param('id') id: string): Promise<UserModel> {
		return this.usersService.deleteUser({ id });
	}
}
