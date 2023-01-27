import { ElectronIpcTransport } from '@doubleshot/nest-electron';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { MicroserviceOptions } from '@nestjs/microservices';
import { app, session } from 'electron';

import { AppModule } from './app.module';
import { isMac } from './constants';

async function electronAppInit() {
	const isDev = !app.isPackaged;

	app.on('window-all-closed', function () {
		if (!isMac) app.quit();
	});

	process.on('SIGTERM', () => {
		app.quit();
	});

	await app.whenReady().then(() => {
		session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
			callback({
				responseHeaders: {
					...details.responseHeaders,
					'Content-Security-Policy': ["script-src 'self'"]
				}
			});
		});
	});
}

(async () => {
	const logger: Logger = new Logger('MAIN');

	try {
		await electronAppInit();

		const nestApp = await NestFactory.createMicroservice<MicroserviceOptions>(
			AppModule,
			{
				strategy: new ElectronIpcTransport('IpcTransport')
			}
		);

		await nestApp.listen();
	} catch (error) {
		logger.error(error);
		app.quit();
	}
})();