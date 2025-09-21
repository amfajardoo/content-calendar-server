import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
	constructor(private readonly goalsService: GoalsService) {}

	@Post()
	async create(@Body() dto: Prisma.GoalCreateInput) {
		return this.goalsService.create(dto);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.goalsService.findOne(id);
	}
}
