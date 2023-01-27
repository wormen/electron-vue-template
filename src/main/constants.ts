import { app } from 'electron';

export const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

export const isMac = process.platform === 'darwin';
export const isWin = process.platform === 'win32';
export const isLinux = process.platform === 'linux';