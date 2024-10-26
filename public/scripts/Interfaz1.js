// INTERFAZ 1: Eliminación de tareas
let taskToDelete = '';

function confirmDelete(taskId) {
    taskToDelete = taskId;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    const taskElement = document.getElementById(taskToDelete);
    
    const boards = JSON.parse(localStorage.getItem('boards')) || {};
    const para = new URLSearchParams(window.location.search);
    const urlId = para.get('id');
    console.log('ID del tablero:', urlId);
    console.log(boards);
    console.log(boards[urlId]);
    console.log(boards[urlId].cards);

    if (boards[urlId] && boards[urlId].cards) {
        const indiceTarea = boards[urlId].cards.findIndex(tarea => tarea.id === taskToDelete);
        console.log(boards[urlId].cards[taskToDelete]);
        if (indiceTarea !== -1) {
            boards[urlId].cards.splice(indiceTarea, 1);
        }
    }

    localStorage.setItem('boards', JSON.stringify(boards));

    if (taskElement) {
        taskElement.remove();
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    modal.hide();
});
