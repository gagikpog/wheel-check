const r = randomGenerator(2);

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

export function getRandomColor(): string {
    return `hsl(${random(0, 359)}deg ${random(40, 100)}% ${random(80, 100)}%)`;
}
