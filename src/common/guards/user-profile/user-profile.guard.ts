import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/features/users/users.service';

@Injectable()
export class UserGuard implements CanActivate {
 constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const userId = request.headers['x-user-id'] as string | undefined;
    if (!userId) throw new UnauthorizedException('Missing X-User-Id header');

    const profile = await this.userService.profile({
      id: userId
    });

    if (!profile) {
      throw new UnauthorizedException('User profile not found');
    }

    request.user = profile;
    return true;
  }
}
