import {
	Body,
	Controller,
	Get,
	Post,
	UnauthorizedException,
	HttpCode,
	Res
} from '@nestjs/common';
import { AuthService } from '@core/auth/auth/auth.service';
import { AuthResponse, AuthTokenResponse } from '@supabase/supabase-js';
import express from 'express'; // or 'fastify'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Get()
	async getHello(): Promise<string> {
		return "Hello World!"
	}

	@Post()
	async authenticate(
		@Res({ passthrough: true }) res: express.Response,
		@Body() postData: { email: string; password: string },
	): Promise<AuthResponse | AuthTokenResponse> {
		const {email, password} = postData;
		if (!email || !password) {
			throw new UnauthorizedException('User ID not found in headers');
		}
		const authResponse = await this.authService.login({email, password});
		if( authResponse. error){
			res.status(authResponse.error.status as number);
		}
		return authResponse;

	}

	@Post("register")
	async register(
		@Res({ passthrough: true }) res: express.Response,
		@Body() postData: { email: string; password: string },
	){
		const {email, password} = postData;
		if (!email || !password) {
			throw new UnauthorizedException('User ID not found in headers');
		}
		const {newUser,authResponse} = await this.authService.register({email, password});
		if(authResponse.error){
			res.status(authResponse.error.status as number);
			return authResponse.error;
		}
		return {user:newUser, auth: authResponse.data};
	}

	@Post("signout")
	async signout(
		@Res({ passthrough: true }) res: express.Response,
	){
		this.authService.logout()
		return {message: "signed out" };
	}
}
