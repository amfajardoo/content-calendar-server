import { SupabaseAuthGuard } from '@core/supabase/supabase-auth.guard';
import {
	Body,
	Controller,
	Get,
	Headers,
	Post,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';
import { PostStatus } from '@prisma/client/wasm';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@UseGuards(SupabaseAuthGuard)
	@Post()
	async createDraft(
		@Body() postData: { title: string; content?: string },
		@Headers('X-User-Id') userId: string,
	): Promise<PostModel> {
		if (!userId) {
			throw new UnauthorizedException('User ID not found in headers');
		}

		const { title, content } = postData;
		return this.postsService.createPost({
			title,
			content,
			author: {
				connect: { id: userId },
			},
			status: PostStatus.DRAFT,
		});
	}

	@UseGuards(SupabaseAuthGuard)
	@Get()
	async getAllPosts() {
		return this.postsService.posts({});
	}
}
