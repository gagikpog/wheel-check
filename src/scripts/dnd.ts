const file = document.querySelector('#dnd-icon');
const dragTarget = document.querySelector('#drag-target');

file.addEventListener('dragstart', dragstartHandler);
dragTarget.addEventListener('drop', dropHandler);
dragTarget.addEventListener('dragover', dragoverHandler);

function dragstartHandler(ev) {
    ev.dataTransfer.setData('application/my-app', ev.target.id);
    ev.dataTransfer.effectAllowed = 'move';
}

function dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
}

function dropHandler(ev) {
    ev.preventDefault();
    document.body.classList.add('drag-icon-hide');
}
