import { PrismaService } from '@core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User as SupabaseUser } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

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
}
