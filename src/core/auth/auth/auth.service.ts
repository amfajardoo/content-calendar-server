import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { SupabaseService } from '@core/supabase/supabase.service';
import { UsersService } from 'src/features/users/users.service';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private supabaseService: SupabaseService,
		private usersService: UsersService,
	) {}

	async syncUser(supabaseUser: SupabaseUser) {
		let user = await this.prisma.user.findUnique({
			where: { id: supabaseUser.id },
		});

		if (!user) {
			user = await this.prisma.user.create({
				data: {
					id: supabaseUser.id,
					email: supabaseUser.email || '',
					name: supabaseUser.user_metadata?.full_name || 'Anonymous',
				},
			});
		}

		return user;
	}

	async login(user: { email: string; password: string }) {
		const { email, password } = user;
		const authTokenResponse =
			await this.supabaseService.SupabaseClient.auth.signInWithPassword({
				email: email,
				password: password,
			});
		// const userDB = await this.usersService.users({where:{id:authTokenResponse.data.user?.id}});
		return authTokenResponse;
		// return {userDB,authTokenResponse}
	}

	async register(user: { email: string; password: string }) {
		const authResponse = await this.supabaseService.SupabaseClient.auth.signUp({
			email: user.email,
			password: user.password,
		});
		if (authResponse.error) {
			return { newUser: null, authResponse };
		}
		const newUser: User = await this.usersService.createUser({
			id: authResponse.data.user?.id,
			email: user.email,
			name: user.password,
		});
		return { newUser, authResponse };
	}

	async resetPasswort(user: { email: string; password: string }) {
		await this.supabaseService.SupabaseClient.auth.resetPasswordForEmail(user.email, {
			redirectTo: 'http://example.com/account/update-password',
		});
		// Luego hacer esto en la pagina de cambiar pwd con usuario autenticado
		// await supabase.auth.updateUser({ password: 'new_password' })
	}

	async logout() {
		await this.supabaseService.SupabaseClient.auth.signOut();
	}
}
