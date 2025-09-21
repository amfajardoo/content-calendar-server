import { Injectable, UseInterceptors } from "@nestjs/common";
import { Prisma, TransactionType } from "@prisma/client";
import { CurrencyFormatInterceptor } from "src/common/interceptors/currency-format/currency-format.interceptor";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
@UseInterceptors(CurrencyFormatInterceptor) 
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: Prisma.TransactionCreateInput) {
    return this.prisma.transaction.create({ data: dto });
  }

  async findAll(query: { type?: TransactionType; categoryId?: string }) {
    return this.prisma.transaction.findMany({
      where: {
        type: query.type, // income | expense
        categoryId: query.categoryId,
      },
      include: { category: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async update(id: string, dto: Prisma.TransactionUpdateInput) {
    return this.prisma.transaction.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
