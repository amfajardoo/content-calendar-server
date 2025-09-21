import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import { SupabaseService } from '../../core/supabase/supabase.service';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService, private supabaseService: SupabaseService) {}

	async profiles(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}): Promise<User[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.user.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async profile(
		userWhereUniqueInput: Prisma.UserWhereUniqueInput,
	): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
		});
	}

	async updateUser(params: {
		where: Prisma.UserWhereUniqueInput;
		data: Prisma.UserUpdateInput;
	}): Promise<User> {
		const { where, data } = params;
		return this.prisma.user.update({
			data,
			where,
		});
	}

  async deleteUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const profile = await this.prisma.user.findUnique({ where });
    if (!profile) return null;

    const { error: deleteError } =
      await this.supabaseService.admin.auth.admin.deleteUser(
        profile.id,
      );

    if (deleteError) {
      throw new Error(`Cannot delete user from Supabase Auth: ${deleteError.message}`);
    }

    return this.prisma.user.delete({
      where: { id: profile.id },
    });
  }

  async getUserCurrency(userId: string): Promise<string> {
    const profile = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { currency: true },
    });

    return profile?.currency ?? 'USD';
  }
}
