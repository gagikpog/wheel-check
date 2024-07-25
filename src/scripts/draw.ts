const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');

if (canvas) {
    const r = randomGenerator(2);
    const mouseButtonColor = Array.from({ length: 5 }, getRandomColor);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas?.getContext('2d');
    const pressedButtons = { 0: false, 1: false, 2: false, 3: false, 4: false };
    const prevMousePosition = { x: 0, y: 0 };

    document.addEventListener('mousedown', (event) => {
        drawCircle(event.clientX, event.clientY, 20, mouseButtonColor[event.button]);
        pressedButtons[event.button] = true;
        prevMousePosition.x = event.clientX;
        prevMousePosition.y = event.clientY;
        if (ctx) {
            ctx.strokeStyle = getRandomColor();
            ctx.lineWidth = 4;
        }
    });

    document.addEventListener('mouseup', (event) => {
        drawCircle(event.clientX, event.clientY, 20, mouseButtonColor[event.button]);
        pressedButtons[event.button] = false;
    });

    document.addEventListener('mousemove', (event) => {
        if (pressedButtons[0]) {
            drawLine(prevMousePosition.x, prevMousePosition.y, event.clientX, event.clientY);
            prevMousePosition.x = event.clientX;
            prevMousePosition.y = event.clientY;
        }
    });

    addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    setInterval(() => {
        if (!pressedButtons[0]) {
            fading();
        }
    }, 50);

    function fading(): void {
        if (canvas && ctx) {
            const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = image.data;
            const size = canvas.width * canvas.height * 4;
            for (let i = 0; i < size; i++) {
                if (pixels[i] > 0) {
                    pixels[i] -= 10;
                }
            }
            ctx.putImageData(image, 0, 0);
        }
    }

    function drawCircle(x: number, y: number, radius: number, fill: string): void {
        if (ctx) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = fill;
            ctx.fill();
        }
    }

    function drawLine(x: number, y: number, toX: number, toY: number): void {
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(toX, toY);
            ctx.stroke();
        }
    }

    function * randomGenerator(previous = 0) {
        while (true) {
            previous = previous * 16807 % 2147483647;
            yield previous;
        }
    }

    function random(min: number, max: number): number {
        const val = r.next().value;
        return Math.round(((val || 0) + min) % max);
    }

    function getRandomColor(): string {
        return `hsl(${random(0, 359)}deg ${random(40, 100)}% ${random(80, 100)}%)`;
    }
}
