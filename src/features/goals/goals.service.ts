import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../core/prisma/prisma.service";
import { toCurrency } from "../../utils/currency.utils";

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: Prisma.GoalCreateInput) {
    return this.prisma.goal.create({ data: dto });
  }

  async findOne(id: string) {
    const goal = await this.prisma.goal.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!goal) return null;

    const spent = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId: goal.userId,
        categoryId: goal.categoryId,
        date: { gte: goal.startDate, lte: goal.endDate },
      },
    });

    const spentAmount = toCurrency(spent._sum.amount);
    const targetAmount = toCurrency(goal.targetAmount);

    return {
      ...goal,
      progress: spentAmount,
      targetAmount,
      achieved: spentAmount >= targetAmount,
    };
  }
}
