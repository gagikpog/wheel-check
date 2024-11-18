import { isLocalHost, MouseButtons } from './constants';
const MOUSE_CLICK_MIN_TIMEOUT = 30;
const MOUSE_WHEEL_MIN_TIMEOUT = 50;

export enum EventTypes {
    MouseWheelUp = 6,
    MouseWheelDown = 7
}

enum Errors {
    MouseUp,
    MouseDown,
    WheelUp,
    WheelDown,
}

const mouseButtons = new Map([
    [MouseButtons.Left, 'left'],
    [MouseButtons.Middle, 'middle'],
    [MouseButtons.Right, 'right'],
    [MouseButtons.Forward, 'forward'],
    [MouseButtons.Back, 'back'],
]);

const errorMessages = new Map([
    [Errors.MouseUp, 'Паразитное отжатие'],
    [Errors.MouseDown, 'Паразитное нажатие'],
    [Errors.WheelUp, 'Отскок вверх'],
    [Errors.WheelDown, 'Отскок вниз']
]);

function getButtonName(key: MouseButtons): string {
    return mouseButtons.get(key);
}

export class Analyzer {
    private _prevWheel = {
        [EventTypes.MouseWheelUp]: 0,
        [EventTypes.MouseWheelDown]: 0
    };

    private _prevMouseDown = {
        [MouseButtons.Left]: 0,
        [MouseButtons.Middle]: 0,
        [MouseButtons.Right]: 0,
        [MouseButtons.Forward]: 0,
        [MouseButtons.Back]: 0
    };

    private _prevMouseUp = {
        [MouseButtons.Left]: 0,
        [MouseButtons.Middle]: 0,
        [MouseButtons.Right]: 0,
        [MouseButtons.Forward]: 0,
        [MouseButtons.Back]: 0
    };

    private _errors = {
        [Errors.MouseUp]: 0,
        [Errors.MouseDown]: 0,
        [Errors.WheelUp]: 0,
        [Errors.WheelDown]: 0,
    };

    private _displayNode: HTMLDivElement;

    constructor({ node }: {node: HTMLDivElement}) {
        this._displayNode = node;
        if (isLocalHost) {
            // @ts-ignore
            window.analyzer = this;
        }
    }

    mouseWheel(value: number): boolean {
        const currentEvent = value > 1 ? EventTypes.MouseWheelDown : EventTypes.MouseWheelUp;
        const inverseEvent = value > 1 ? EventTypes.MouseWheelUp : EventTypes.MouseWheelDown;
        const now = Date.now();

        const delta = now - this._prevWheel[inverseEvent];

        const error = delta < MOUSE_WHEEL_MIN_TIMEOUT;

        if (error) {
            this._log(`mouse wheel ${currentEvent === EventTypes.MouseWheelDown ? 'down' : 'up'}`, delta, error);
            this._errors[currentEvent === EventTypes.MouseWheelDown ? Errors.WheelDown: Errors.WheelUp]++;
            this._updateDisplay();
        }

        this._prevWheel[currentEvent] = Date.now();
        return error;
    }

    mouseDown(button: MouseButtons): boolean {
        const now = Date.now();
        const delta = now - this._prevMouseUp[button];
        this._prevMouseDown[button] = now;
        const error = delta < MOUSE_CLICK_MIN_TIMEOUT;
        if (error) {
            this._errors[Errors.MouseDown]++;
            this._updateDisplay();
        }
        this._log(`mouse up button ${getButtonName(button)}`, delta, error);
        return error;
    }

    mouseUp(button: MouseButtons): boolean {
        const now = Date.now();
        const delta = now - this._prevMouseDown[button];
        this._prevMouseUp[button] = now;
        const error = delta < MOUSE_CLICK_MIN_TIMEOUT;
        if (error) {
            this._errors[Errors.MouseUp]++;
            this._updateDisplay();
        }
        this._log(`mouse up button ${getButtonName(button)}`, delta, error);
        return error;
    }

    reset(): void {
        if (isLocalHost) {
            console.clear();
        }
        this._errors[Errors.MouseUp] = 0;
        this._errors[Errors.MouseDown] = 0;
        this._errors[Errors.WheelUp] = 0;
        this._errors[Errors.WheelDown] = 0;
        this._updateDisplay();
    }

    getErrors(){
        return Object.entries(this._errors).map(([key, count]) => {
            return {
                caption: errorMessages.get(Number(key)),
                count
            };
        }).filter((item) => item.count);
    }

    private _updateDisplay(): void {
        this._displayNode.textContent = '';
        this.getErrors().map((item) => {
            const captionNode = document.createElement('div');
            const countNode = document.createElement('div');
            captionNode.textContent = item.caption;
            countNode.textContent = String(item.count);
            this._displayNode.appendChild(captionNode);
            this._displayNode.appendChild(countNode);
        });
    }

    private _log(eventType: string, delta: number, error = false): void {
        if (isLocalHost) {
            console.log(`%c${eventType} - ${delta}ms`, `color:${error ? 'red' : 'white'}`);
        }
    }
}
