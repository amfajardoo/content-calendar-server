import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// Categorías iniciales
	const categories = [
		{ name: 'Food', type: TransactionType.expense },
		{ name: 'Transport', type: TransactionType.expense },
		{ name: 'Entertainment', type: TransactionType.expense },
		{ name: 'Shopping', type: TransactionType.expense },
		{ name: 'Health', type: TransactionType.expense },
		{ name: 'Utilities', type: TransactionType.expense },
		{ name: 'Salary', type: TransactionType.income },
		{ name: 'Freelance', type: TransactionType.income },
		{ name: 'Investments', type: TransactionType.income },
		{ name: 'Gifts', type: TransactionType.income },
	];

	for (const category of categories) {
		await prisma.category.upsert({
			where: { name_type: { name: category.name, type: category.type } },
			update: {},
			create: {
				name: category.name,
				type: category.type,
				userId: null,
			},
		});
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
