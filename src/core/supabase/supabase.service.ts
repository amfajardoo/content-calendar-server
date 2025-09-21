import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private anonClient: SupabaseClient;
  private adminClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const anonKey = this.configService.get<string>('SUPABASE_ANON_KEY');
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error('Missing Supabase env vars');
    }

    this.anonClient = createClient(supabaseUrl, anonKey);
    this.adminClient = createClient(supabaseUrl, serviceRoleKey);
  }

  get client(): SupabaseClient {
    return this.anonClient; // 👉 para signUp, signIn
  }

  get admin(): SupabaseClient {
    return this.adminClient; // 👉 para auth.admin.*
  }
}
