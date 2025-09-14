import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}

	@Get('health')
	getHealth(): { status: string; timestamp: string } {
		return {
			status: 'ok',
			timestamp: new Date().toISOString(),
		};
	}
}
