import { Injectable, UseInterceptors } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CurrencyFormatInterceptor } from "../../common/interceptors/currency-format/currency-format.interceptor";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
@UseInterceptors(CurrencyFormatInterceptor) 
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      include: { transactions: true },
    });
  }

  async create(dto: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({ data: dto });
  }

  async remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
