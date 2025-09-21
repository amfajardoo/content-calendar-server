import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "src/common/decorators/public.decorator";
import { SupabaseService } from "./supabase.service";
import { UsersService } from "src/features/users/users.service";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private usersService: UsersService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Missing Authorization header");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthorizedException("Invalid token format");
    }

    const { data, error } = await this.supabaseService.client.auth.getUser(token);

    if (error || !data?.user) {
      throw new UnauthorizedException("Invalid or expired token");
    }

    const userId = data.user.id;
    const profile = await this.usersService.profile({ id: userId });

    if (!profile) {
      throw new UnauthorizedException("User profile not found");
    }

    request.user = profile;

    return true;
  }
}
