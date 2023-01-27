import { Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
	getTime(): number {
		return new Date().getTime();
	}
}