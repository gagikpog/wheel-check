document.addEventListener('DOMContentLoaded', function() {
    let up = 0;
    let down = 0;
    const lang = location.pathname.includes('en') ? 'en' : 'ru';
    const upText = lang === 'en' ? 'Up' : 'Вверх';
    const downText = lang === 'en' ? 'Down' : 'Вниз';

    const checkArea = document.querySelector('#checkArea');
    const info = document.querySelector('#info');
    const scrollHere = document.querySelector('#scrollHere');
    const resetButton = document.querySelector('#reset');

    function updateInfo() {
        if (info) {
            info.textContent = `${downText}: ${down} ${upText}: ${up}`;
        }
    }

    function mouseWheel(e) {
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

    function reset() {
        down = 0;
        up = 0;
        updateInfo();
        document.body.classList.remove(...document.body.classList);
        if (checkArea) {
            checkArea.textContent = '';
        }
    }

    if (scrollHere) {
        scrollHere.addEventListener('mousewheel', mouseWheel);
    }
    if (resetButton) {
        resetButton.addEventListener('click', reset);
    }
    updateInfo();

    const classes = {
        0: 'st-left',
        1: 'st-middle',
        2: 'st-right',
        3: 'st-forward',
        4: 'st-back'
    };

    document.addEventListener('mousedown', (event) => {
        const className = classes[event.button];
        if (event.button !== 0) {
            event.preventDefault();
        }
        if (className) {
            document.body.classList.add(className);
            document.body.classList.add(className + '-active');
        }
    });
    document.addEventListener('mouseup', (event) => {
        const className = classes[event.button];
        if (event.button !== 0) {
            event.preventDefault();
        }
        if (className) {
            document.body.classList.remove(className);
        }
    });

    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    }, false);

    document.addEventListener('mousemove', (event) => {
        document.body.style.setProperty('--mouse-x', event.clientX + 'px');
        document.body.style.setProperty('--mouse-y', event.clientY + 'px');
    })

});
