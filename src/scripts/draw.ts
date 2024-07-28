import { getRandomColor } from './color';

const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
let hasImage = false;

if (canvas) {
    const mouseButtonColor = Array.from({ length: 5 }, getRandomColor);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas?.getContext('2d');
    const pressedButtons = { 0: false, 1: false, 2: false, 3: false, 4: false };
    const prevMousePosition = { x: 0, y: 0 };

    document.addEventListener('mousedown', (event: MouseEvent) => {
        const target: HTMLElement = event.target as HTMLElement;
        if (!target.closest('.js-no-click')) {
            drawCircle(ctx, event.clientX, event.clientY, 20, mouseButtonColor[event.button]);
            pressedButtons[event.button] = true;
            prevMousePosition.x = event.clientX;
            prevMousePosition.y = event.clientY;
            hasImage = true;
            if (ctx) {
                ctx.strokeStyle = getRandomColor();
                ctx.lineWidth = 4;
            }
        }
    });

    document.addEventListener('mouseup', (event) => {
        if (pressedButtons[event.button]) {
            drawCircle(ctx, event.clientX, event.clientY, 20, mouseButtonColor[event.button]);
            pressedButtons[event.button] = false;
        }
    });

    document.addEventListener('mousemove', (event) => {
        if (pressedButtons[0]) {
            drawLine(ctx, prevMousePosition.x, prevMousePosition.y, event.clientX, event.clientY);
            prevMousePosition.x = event.clientX;
            prevMousePosition.y = event.clientY;
        }
    });

    addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    setInterval(() => {
        if (!pressedButtons[0] && hasImage) {
            fading(canvas, ctx);
        }
    }, 50);
}

function fading(canvas1: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    if (canvas1 && ctx) {
        const image = ctx.getImageData(0, 0, canvas1.width, canvas1.height);
        const pixels = image.data;
        const size = canvas1.width * canvas1.height * 4;
        hasImage = false;
        for (let i = 0; i < size; i++) {
            if (pixels[i] > 0) {
                pixels[i] -= 10;
                hasImage = true;
            }
        }
        ctx.putImageData(image, 0, 0);
    }
}

function drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill: string): void {
    if (ctx) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = fill;
        ctx.fill();
    }
}

function drawLine(ctx: CanvasRenderingContext2D, x: number, y: number, toX: number, toY: number): void {
    if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }
}
