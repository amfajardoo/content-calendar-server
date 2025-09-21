import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SupabaseService } from './supabase.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { UsersModule } from '../../features/users/users.module';

@Global()
@Module({
	imports: [AuthModule, UsersModule],
	providers: [SupabaseService, SupabaseAuthGuard],
	exports: [SupabaseService, SupabaseAuthGuard],
})
export class SupabaseModule {}
