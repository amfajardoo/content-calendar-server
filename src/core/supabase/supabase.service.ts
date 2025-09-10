import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
	constructor(private configService: ConfigService) {}

	get SupabaseClient(): SupabaseClient {
		const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
		const serviceRoleKey = this.configService.get<string>('SERVICE_ROLE_KEY');

		if (!supabaseUrl || !serviceRoleKey) {
			throw new Error(
				'Missing required environment variables: SUPABASE_URL or SERVICE_ROLE_KEY',
			);
		}

		return createClient(supabaseUrl, serviceRoleKey);
	}
}