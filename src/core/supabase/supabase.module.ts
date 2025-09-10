import { AuthModule } from '@core/auth/auth.module';
import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Global()
@Module({
	imports: [AuthModule],
	providers: [SupabaseService, SupabaseAuthGuard],
	exports: [SupabaseService, SupabaseAuthGuard],
})
export class SupabaseModule {}
