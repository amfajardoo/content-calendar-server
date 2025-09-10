import { AuthModule } from '@core/auth/auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/prisma/prisma.module';
import { SupabaseModule } from './core/supabase/supabase.module';
import { PostsModule } from './features/posts/posts.module';
import { UsersModule } from './features/users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		PostsModule,
		UsersModule,
		AuthModule,
		SupabaseModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
