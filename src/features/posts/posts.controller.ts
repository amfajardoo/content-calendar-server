import {
	Body,
	Controller,
	Get,
	Headers,
	Post,
	UnauthorizedException,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';
import { PostStatus } from '@prisma/client/wasm';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Post()
	async createDraft(
		@Body() postData: { title: string; content?: string },
		@Headers('user-id') userId: string,
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

	@Get()
	async getAllPosts() {
		return this.postsService.posts({});
	}
}
