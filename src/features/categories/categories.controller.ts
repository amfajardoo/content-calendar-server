import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	async findAll(@Query('userId') userId: string) {
		return this.categoriesService.findAll(userId);
	}

	@Post()
	async create(@Body() dto: Prisma.CategoryCreateInput) {
		return this.categoriesService.create(dto);
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.categoriesService.remove(id);
	}
}
