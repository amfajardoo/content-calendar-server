import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { map, Observable } from 'rxjs';
import { getDecimalsForCurrency, toCurrency } from 'src/utils/currency.utils';

@Injectable()
export class CurrencyFormatInterceptor implements NestInterceptor {
	private readonly currencyFields = ['amount', 'targetAmount', 'progress'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const User = request.user as User;

    const decimals = getDecimalsForCurrency(User.currency);

    return next.handle().pipe(
      map((data) => this.formatCurrency(data, decimals)),
    );
  }

	private formatCurrency(data: unknown, decimals: number): unknown {
		if (Array.isArray(data)) {
			return data.map((item) => this.formatCurrency(item, decimals));
		}
		if (data && typeof data === 'object') {
			const formatted: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(data)) {
				if (this.currencyFields.includes(key)) {
					formatted[key] = toCurrency(value, decimals);
				} else if (Array.isArray(value) || typeof value === 'object') {
					formatted[key] = this.formatCurrency(value, decimals);
				} else {
					formatted[key] = value;
				}
			}
			return formatted;
		}
		return data;
	}
}
