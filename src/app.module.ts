import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { SupabaseModule } from './core/supabase/supabase.module';
import { CategoriesModule } from './features/categories/categories.module';
import { GoalsModule } from './features/goals/goals.module';
import { TransactionsModule } from './features/transactions/transactions.module';
import { UsersModule } from './features/users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		UsersModule,
		AuthModule,
		SupabaseModule,
		CategoriesModule,
		GoalsModule,
		TransactionsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
