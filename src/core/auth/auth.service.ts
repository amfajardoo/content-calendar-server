import { Injectable } from "@nestjs/common";
import { AuthTokenResponsePassword, SignInWithPasswordCredentials, AuthResponse, AuthError, User, Session } from "@supabase/supabase-js";
import { SupabaseService } from "../supabase/supabase.service";

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

export type RefreshResponse = {
    data: {
        user: User | null;
        session: Session | null;
    } | {
        user: null;
        session: null;
    };
    error: AuthError | null;
};

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async login(credentials: SignInWithPasswordCredentials): Promise<AuthTokenResponsePassword> {
    const authTokenResponse = await this.supabaseService.client.auth.signInWithPassword(credentials);
    return authTokenResponse;
  }
  
  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const { data, error } = await this.supabaseService.client.auth.refreshSession({
      refresh_token: refreshToken,
    });
    
    return { data, error };
  }

  async register(credentials: CredentialsWithEmail) {
    return this.registerWithEmail(credentials);
  }

  async registerWithEmail(credentials: CredentialsWithEmail) {
    try {
      const authResponse = await this.supabaseService.client.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
        },
      });
      if (authResponse.error) {
        return { newUser: null, error: authResponse.error };
      }
      const newUser = authResponse.data.user;
      return { newUser, error: null };
    } catch (err) {
      const error: AuthError = new AuthError(err?.message || "Unknown error");
      return { newUser: null, error };
    }
  }

  async resetPasswort(user: { email: string; password: string }) {
    await this.supabaseService.client.auth.resetPasswordForEmail(user.email, {
      redirectTo: "http://example.com/account/update-password",
    });
  }

  async logout() {
    await this.supabaseService.client.auth.signOut();
  }
}