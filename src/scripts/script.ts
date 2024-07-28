import { Analyzer } from './analyzer';
import { lang, MouseButtons, DOUBLE_CLICK_TIMEOUT } from './constants';
import { getId } from './counter';
import { debounce } from './debounce';

let up = 0;
let down = 0;
let leftButtonPressTimeout = 0;
const upText = lang === 'en' ? 'Up' : 'Вверх';
const downText = lang === 'en' ? 'Down' : 'Вниз';

const checkArea = document.querySelector('#check-area');
const info = document.querySelector('#info');
const contentArea = document.querySelector('#content-area');
const resetButton = document.querySelector('#reset');
const displayNode: HTMLDivElement = document.querySelector('#display');
const analyzer = new Analyzer({node: displayNode});
const buttonCountIds = {
    [MouseButtons.Left]: '#mouse-left-count',
    [MouseButtons.Middle]: '#mouse-middle-count',
    [MouseButtons.Right]: '#mouse-right-count',
    [MouseButtons.Back]: '#mouse-back-count',
    [MouseButtons.Forward]: '#mouse-forward-count'
};
const classes = {
    [MouseButtons.Left]: 'st-left',
    [MouseButtons.Middle]: 'st-middle',
    [MouseButtons.Right]: 'st-right',
    [MouseButtons.Back]: 'st-back',
    [MouseButtons.Forward]: 'st-forward'
};

const removeWheelUpClass = debounce(() => document.body.classList.remove('st-wheel-up'), 300);
const removeWheelDownClass = debounce(() => document.body.classList.remove('st-wheel-down'), 300);

function updateInfo(): void {
    if (info) {
        info.textContent = `${downText}: ${down} ${upText}: ${up}`;
    }
    document.body.style.setProperty('--mouse-wheel-index', String(down - up + 100));
}

function mouseWheel(e: WheelEvent): void {
    const delta = e.deltaY || e.detail;
    const error = analyzer.mouseWheel(delta);
    if (checkArea) {
        const child = document.createElement('span');
        child.id = getId();
        if (delta > 0) {
            child.textContent = downText;
            child.classList.add('wheel-down');
            document.body.classList.add('st-wheel-down');
            removeWheelDownClass();
            down++;
        } else {
            child.textContent = upText;
            child.classList.add('wheel-up');
            document.body.classList.add('st-wheel-up');
            removeWheelUpClass();
            up++;
        }
        if (error) {
            child.classList.add('wheel-error');
        }
        checkArea.appendChild(child);
        checkArea.scrollTop = checkArea.scrollHeight;
    }
    updateInfo();
}

function reset(): void {
    down = 0;
    up = 0;
    updateInfo();
    document.body.classList.remove(...Array.from(document.body.classList));
    if (checkArea) {
        checkArea.textContent = '';
    }
    Object.values(buttonCountIds).forEach((id) => {
        if (document.querySelector(id)) {
            document.querySelector(id).textContent = '';
        }
    });
    analyzer.reset();
}

contentArea?.addEventListener('mousewheel', mouseWheel);
resetButton?.addEventListener('click', reset);

updateInfo();

document.addEventListener('mousedown', (event: MouseEvent) => {
    analyzer.mouseDown(event.button);
    const className = classes[event.button];
    const buttonCount = document.querySelector(buttonCountIds[event.button]);
    buttonCount.textContent = Number(buttonCount.textContent || 0) + 1;

    if (event.button !== 0) {
        event.preventDefault();
    } else {
        const now = Date.now();
        if (now - leftButtonPressTimeout < DOUBLE_CLICK_TIMEOUT) {
            onDoubleClick(event);
        }
        leftButtonPressTimeout = now;
    }
    if (className) {
        document.body.classList.add(className);
        document.body.classList.add(className + '-active');
    }
});

document.addEventListener('mouseup', (event: MouseEvent) => {
    analyzer.mouseUp(event.button);
    const className = classes[event.button];
    if (event.button !== 0) {
        event.preventDefault();
    }
    if (className) {
        document.body.classList.remove(className);
    }
});

document.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();
}, false);

document.addEventListener('mousemove', (event: MouseEvent) => {
    document.body.style.setProperty('--mouse-x', event.clientX + 'px');
    document.body.style.setProperty('--mouse-y', event.clientY + 'px');
});

function onDoubleClick(event: MouseEvent) {
    const target: HTMLElement = event.target as HTMLElement;
    if (target.closest('.dnd-icon')) {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    }
}
