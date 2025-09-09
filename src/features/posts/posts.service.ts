import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class PostsService {
	constructor(private prisma: PrismaService) {}

	async createPost(data: Prisma.PostCreateInput): Promise<Post> {
		return this.prisma.post.create({
			data,
		});
	}

	async posts(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.PostWhereUniqueInput;
		where?: Prisma.PostWhereInput;
		orderBy?: Prisma.PostOrderByWithRelationInput;
	}): Promise<Post[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.post.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}
}
