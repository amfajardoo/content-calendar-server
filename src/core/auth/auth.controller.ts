import { Body, Controller, Post, UnauthorizedException, Res, Get, Req } from '@nestjs/common';
import type { SignInWithPasswordCredentials } from '@supabase/supabase-js';
import type { CredentialsWithEmail } from './auth.service';
import { AuthService } from './auth.service';
import { type Response, type Request } from 'express';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  async authenticate(
    @Body() credentials: SignInWithPasswordCredentials,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string; userId: string }> {
    const authResponse = await this.authService.login(credentials);
    
    if (authResponse.error || !authResponse.data.session) {
      throw new UnauthorizedException(authResponse.error?.message || 'Invalid credentials');
    }

    const { session, user } = authResponse.data;

    response.cookie('supabase-refresh-token', session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      path: '/',
    });

    return {
      accessToken: session.access_token,
      userId: user.id,
    };
  }

  @Post('register')
  @Public()
  async register(@Body() credentials: CredentialsWithEmail) {
    const res = await this.authService.register(credentials);
    if (res.error) {
      throw new UnauthorizedException(res.error.message);
    }
    return { user: res.newUser };
  }
  
  @Get('refresh-token')
  @Public()
  async refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies['supabase-refresh-token'];

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const newSession = await this.authService.refresh(refreshToken);

    if (newSession.error || !newSession.data.session) {
      response.clearCookie('supabase-refresh-token');
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    if (newSession.data.session.refresh_token) {
      response.cookie('supabase-refresh-token', newSession.data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        path: '/',
      });
    }

    return {
      accessToken: newSession.data.session.access_token,
      userId: newSession.data.session.user.id,
    };
  }

  @Post('signout')
  async signout(@Res({ passthrough: true }) response: Response) {
    await this.authService.logout();
    response.clearCookie('supabase-refresh-token');
    return { message: 'Logged out successfully' };
  }
}