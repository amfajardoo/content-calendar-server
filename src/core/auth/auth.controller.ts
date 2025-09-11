import { Controller, Post, Body, Res, UnauthorizedException } from '@nestjs/common';

import { type Response } from 'express';

import { type SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { AuthService, type CredentialsWithEmail } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post()
	async authenticate(
		@Body() credentials: SignInWithPasswordCredentials,
		@Res({ passthrough: true }) res: Response
	): Promise<{ userId: string }> {

		const authResponse = await this.authService.login(credentials);
		if (authResponse.error) {
			throw new UnauthorizedException(authResponse.error.message);
		}
		const accessToken = authResponse.data.session?.access_token;

		res.cookie('accessToken', accessToken, {
			httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
			secure: process.env.NODE_ENV === 'production', // Recommended for production to only send over HTTPS
			maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration in milliseconds (e.g., 7 days)
			sameSite: 'lax', // Or 'strict' or 'none', depending on your needs for CSRF protection
		});
		return { userId: authResponse.data.user?.id };
	}

	@Post('register')
	async register(@Body() credentials: CredentialsWithEmail) {
		const res = await this.authService.register(credentials);
		if (res.error) {
			throw new UnauthorizedException(res.error.message);
		}

		return { user: res.newUser };
	}

	@Post('signout')
	async signout() {
		return this.authService.logout();
	}
}
