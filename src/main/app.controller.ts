import { IpcOn, Window } from '@doubleshot/nest-electron';
import { Controller } from '@nestjs/common';
import { BrowserWindow } from 'electron';

import { AppService } from './app.service';


@Controller()
export class AppController {
	constructor(
		private readonly service: AppService,
		@Window() private readonly mainWin: BrowserWindow
	) {}

	@IpcOn('message')
	async messageHandle(msg: string) {
		console.log(msg);
	}
}