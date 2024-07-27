
let up = 0;
let down = 0;
const lang = location.pathname.includes('en') ? 'en' : 'ru';
const upText = lang === 'en' ? 'Up' : 'Вверх';
const downText = lang === 'en' ? 'Down' : 'Вниз';

const checkArea = document.querySelector('#check-area');
const info = document.querySelector('#info');
const contentArea = document.querySelector('#content-area');
const resetButton = document.querySelector('#reset');
const buttonCountIds = {
    0: '#mouse-left-count',
    1: '#mouse-middle-count',
    2: '#mouse-right-count',
    3: '#mouse-back-count',
    4: '#mouse-forward-count'
};
const classes = {
    0: 'st-left',
    1: 'st-middle',
    2: 'st-right',
    3: 'st-back',
    4: 'st-forward'
};

function updateInfo(): void {
    if (info) {
        info.textContent = `${downText}: ${down} ${upText}: ${up}`;
    }
}

function mouseWheel(e: WheelEvent): void {
    const delta = e.deltaY || e.detail;
    if (checkArea) {
        const child = document.createElement('span');
        if (delta > 0) {
            child.textContent = downText;
            child.classList.add('wheel-down');
            down++;
        } else {
            child.textContent = upText;
            child.classList.add('wheel-up');
            up++;
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
}

contentArea?.addEventListener('mousewheel', mouseWheel);
resetButton?.addEventListener('click', reset);

updateInfo();

document.addEventListener('mousedown', (event: MouseEvent) => {
    const className = classes[event.button];
    const buttonCount = document.querySelector(buttonCountIds[event.button]);
    buttonCount.textContent = Number(buttonCount.textContent || 0) + 1;

    if (event.button !== 0) {
        event.preventDefault();
    }
    if (className) {
        document.body.classList.add(className);
        document.body.classList.add(className + '-active');
    }
});

document.addEventListener('mouseup', (event: MouseEvent) => {
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
