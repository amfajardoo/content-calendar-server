import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import type {
	AuthResponse,
	AuthTokenResponse,
	SignInWithPasswordCredentials,
} from '@supabase/supabase-js';
import type { CredentialsWithEmail } from './auth.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	async authenticate(
		@Body() credentials: SignInWithPasswordCredentials,
	): Promise<{ accessToken: string; userId: string }> {
		const authResponse = await this.authService.login(credentials);
		if (authResponse.error) {
			throw new UnauthorizedException(authResponse.error.message);
		}
		return { accessToken: authResponse.data.session?.access_token, userId: authResponse.data.user?.id };
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
