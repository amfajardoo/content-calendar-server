import { PrismaService } from "@core/prisma/prisma.service";
import { SupabaseService } from "@core/supabase/supabase.service";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthError, AuthTokenResponsePassword, SignInWithPasswordCredentials, User as SupabaseUser } from "@supabase/supabase-js";
import { UsersService } from "src/features/users/users.service";

export type CredentialsWithEmail = {
  email: string;
  password: string;
  options?:
    | {
        emailRedirectTo?: string | undefined;
        data?: object | undefined;
        captchaToken?: string | undefined;
      }
    | undefined;
} & {
  name: string;
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
    private usersService: UsersService
  ) {}

  async syncUser(supabaseUser: SupabaseUser) {
    let user = await this.prisma.user.findUnique({
      where: { id: supabaseUser.id },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          name: supabaseUser.user_metadata?.full_name || "Anonymous",
        },
      });
    }

    return user;
  }

  async login(credentials: SignInWithPasswordCredentials): Promise<AuthTokenResponsePassword> {
    const authTokenResponse = await this.supabaseService.SupabaseClient.auth.signInWithPassword(credentials);
    return authTokenResponse;
  }

  async register(credentials: CredentialsWithEmail) {
    return this.registerWithEmail(credentials);
  }

  async registerWithEmail(credentials: CredentialsWithEmail) {
    try {
			const userFound = await this.usersService.user({ email: credentials.email });
      if (userFound) {
				const error: AuthError = new AuthError("User already exists")
        return { newUser: null, error };
      }

      const authResponse = await this.supabaseService.SupabaseClient.auth.signUp(credentials);
      if (authResponse.error) {
        return { newUser: null, error: authResponse.error };
      }

      const newUser: User = await this.usersService.createUser({
        id: authResponse.data.user?.id,
        email: credentials.email,
        name: credentials.name,
      });

      return { newUser, error: null };
    } catch (err) {
			const error: AuthError = new AuthError(err?.message || "Unknown error")
      return { newUser: null, error };
    }
  }

  async resetPasswort(user: { email: string; password: string }) {
    await this.supabaseService.SupabaseClient.auth.resetPasswordForEmail(user.email, {
      redirectTo: "http://example.com/account/update-password",
    });
    // await supabase.auth.updateUser({ password: 'new_password' })
  }

  async logout() {
    await this.supabaseService.SupabaseClient.auth.signOut();
  }
}
