export const isLocalHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
export const lang = location.pathname.includes('en') ? 'en' : 'ru';

export enum MouseButtons {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4
}
