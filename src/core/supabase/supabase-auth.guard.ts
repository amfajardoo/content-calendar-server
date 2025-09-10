import { SupabaseService } from '@core/supabase/supabase.service';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth/auth.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private supabaseService: SupabaseService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization;

		if (!authHeader) {
			throw new UnauthorizedException('Missing Authorization header');
		}

		const token = authHeader.split(' ')[1];
		if (!token) {
			throw new UnauthorizedException('Invalid token format');
		}

		const { data, error } =
			await this.supabaseService.SupabaseClient.auth.getUser(token);

		if (error || !data?.user) {
			throw new UnauthorizedException('Invalid or expired token');
		}

		const user = await this.authService.syncUser(data.user);

		request.user = user;

		return true;
	}
}
