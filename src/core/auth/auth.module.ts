import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../../features/users/users.module';
import { AuthController } from './auth.controller';

@Global()
@Module({
	imports: [UsersModule],
	providers: [AuthService],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
