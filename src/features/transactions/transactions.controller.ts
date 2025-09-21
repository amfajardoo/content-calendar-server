import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { Prisma, TransactionType } from "@prisma/client";
import { TransactionsService } from "./transactions.service";

@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  async create(@Body() dto: Prisma.TransactionCreateInput) {
    return this.transactionsService.create(dto);
  }

  @Get()
  async findAll(@Query() query: { type?: TransactionType; categoryId?: string }) {
    return this.transactionsService.findAll({
      type: query.type, // income | expense
      categoryId: query.categoryId,
    });
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.transactionsService.findOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: Prisma.TransactionUpdateInput) {
    return this.transactionsService.update(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.transactionsService.remove(id);
  }
}
