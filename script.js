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
            if (delta > 0) {
                checkArea.textContent += `\n${downText}`;
                down++;
            } else {
                checkArea.textContent += `\n${upText}`;
                up++;
            }
            checkArea.scrollTop = checkArea.scrollHeight;
        }
        updateInfo();
    }

    function reset() {
        down = 0;
        up = 0;
        updateInfo();
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

});
