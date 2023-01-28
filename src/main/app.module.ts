import { ElectronModule } from '@doubleshot/nest-electron';
import { Module } from '@nestjs/common';
import { BrowserWindow, app } from 'electron';
import { join } from 'path';
import * as url from 'url';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { isDev } from './constants';


@Module({
	imports: [
		ElectronModule.registerAsync({
			useFactory: async () => {
				const win = new BrowserWindow({
					width: 800,
					height: 600,
					autoHideMenuBar: true,
					webPreferences: {
						preload: join(__dirname, 'preload.js'),
						nodeIntegration: false,
						contextIsolation: true
					}
				});

				win.on('closed', () => {
					win.destroy();
				});

				const URL = isDev
					? `http://localhost:${process.argv[2]}`
					: url
							.pathToFileURL(join(app.getAppPath(), 'renderer', 'index.html'))
							.toString();

				win.loadURL(URL);

				return { win };
			}
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}