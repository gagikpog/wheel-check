function getCounter() {
    let count = 0;
    return () => count++;
}

function getIdGenerator(prefix: string) {
    const counter = getCounter();
    return () => `${prefix}${counter()}`;
}

export const getId = getIdGenerator('node-');
