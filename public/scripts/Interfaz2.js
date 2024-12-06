// INTERFAZ 2: Validación y creación de tareas

import { addTask } from './querisFr.js';
import { formatoDueDate } from './Interfaz1.js';
import { socket } from './socket.js';

const createTaskModal = document.getElementById("addTaskModal");

let buttonColumnSource = null;

createTaskModal.addEventListener("show.bs.modal", (event) => {
    buttonColumnSource = event.relatedTarget.getAttribute("data-click-source");
});

const form = document.getElementById('taskForm');

function validarDatos(elemento){
    if (!elemento.value) {
        elemento.classList.add('is-invalid');
        return false;
    } else {
        elemento.classList.remove('is-invalid');
        return true;
    }
}

form.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir envío por defecto
    let isValid = true;
    const title = document.getElementById('taskTitle');
    const description = document.getElementById('taskDescription');
    const dueDate = document.getElementById('taskDueDate');
    const assignee = document.getElementById('taskAssignee');

    isValid = validarDatos(title) && validarDatos(description) && validarDatos(dueDate) && validarDatos(assignee);
    // Si todo es válido, crear nueva tarea
    if (isValid) { 
        var idColumnaSw=0;
        let taskList;
        const para = new URLSearchParams(window.location.search);
        const urlId = para.get('id');
        switch(buttonColumnSource){
            case "todo": 
                taskList = document.getElementById("todo-tasks"); 
                idColumnaSw=1;
                break;
            case "doing": 
                taskList = document.getElementById("doing-tasks");
                idColumnaSw=2;
                break;
            case "done": 
                taskList = document.getElementById("done-tasks"); 
                idColumnaSw=3;
                break;
            default: 
                taskList = document.getElementById("todo-tasks");
                idColumnaSw=1;
                break;
        }

        const result = await addTask({
            panelId: urlId,
            title: title.value,
            description: description.value,
            date: dueDate.value,
            assignee: assignee.value,
            columnId: idColumnaSw
        }, urlId);

        title.value = '';
        description.value = '';
        dueDate.value = '';
        assignee.value = ''; 

        const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
        if (modal)
            modal.hide();
    }
});

// Add task - socket
socket.on("taskAdded", (arg) => {
    const para = new URLSearchParams(window.location.search);
    const urlId = para.get('id');

    if (arg.boardId != urlId){
        return
    }

    const newTask = document.createElement('div');
    newTask.className = 'task card p-2 mb-2';
    newTask.draggable = true;
    newTask.ondragstart = function(event) {  };
    newTask.innerHTML = `
        <h5 class="titulo">${arg.task.title}</h5>
        <p class="descripcion">${arg.task.description}</p>
        <p>Fecha límite: ${formatoDueDate(arg.task.dueDate)}</p>
        <p class="responsable">Responsable: ${arg.task.assignee}</p> <!-- Añadir el responsable -->
        <button onclick="confirmDelete('${arg.task.id}')" class="btn btn-danger btn-sm">Eliminar</button>
        <button onclick="editTask('${arg.task.id}')" class="btn btn-warning btn-sm">Editar</button>
    `;
    newTask.id = arg.task.id;

    let taskList = document.getElementById("todo-tasks");
    switch(arg.task.columnId){
        case "1": taskList = document.getElementById("todo-tasks"); break;
        case "2": taskList = document.getElementById("doing-tasks"); break;
        case "3": taskList = document.getElementById("done-tasks"); break;
    }

    taskList.appendChild(newTask);

});

// const title = document.getElementById('taskTitle');
// if (!title.value) {
//     title.classList.add('is-invalid');
//     isValid = false;
// } else {
//     title.classList.remove('is-invalid');
// }

// // Validar descripción
// const description = document.getElementById('taskDescription');
// if (!description.value) {
//     description.classList.add('is-invalid');
//     isValid = false;
// } else {
//     description.classList.remove('is-invalid');
// }

// // Validar fecha
// const dueDate = document.getElementById('taskDueDate');
// if (!dueDate.value) {
//     dueDate.classList.add('is-invalid');
//     isValid = false;
// } else {
//     dueDate.classList.remove('is-invalid');
// }

// // Validar responsable
// const assignee = document.getElementById('taskAssignee');
// if (!assignee.value) {
//     assignee.classList.add('is-invalid');
//     isValid = false;
// } else {
//     assignee.classList.remove('is-invalid');
// }