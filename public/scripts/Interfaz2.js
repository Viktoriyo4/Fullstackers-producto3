// INTERFAZ 2: Validación y creación de tareas

import { addTask } from './querisFr.js';

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
        const boards = JSON.parse(localStorage.getItem('boards')) || {};
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

        const newTask = document.createElement('div');
        newTask.className = 'task card p-2 mb-2';
        newTask.draggable = true;
        newTask.ondragstart = function(event) {  };
        //drag(event);
        const nuevaTask = await addTask({
            panelId: urlId,
            title: title.value,
            description: description.value,
            date: dueDate.value,
            assignee: assignee.value,
            columnId: idColumnaSw
        });
        const tarjeta = nuevaTask.data.addTask;
        // BORRAR
        console.log(tarjeta);
        newTask.innerHTML = `
            <h5 class="titulo">${tarjeta.title}</h5>
            <p class="descripcion">${tarjeta.description}</p>
            <p>Fecha límite: ${tarjeta.dueDate}</p>
            <p class="responsable">Responsable: ${tarjeta.assignee}</p> <!-- Añadir el responsable -->
            <button onclick="confirmDelete('${tarjeta.id}')" class="btn btn-danger btn-sm">Eliminar</button>
            <button onclick="editTask('${tarjeta.id}')" class="btn btn-warning btn-sm">Editar</button>
        `;

        taskList.appendChild(newTask);


        if (boards[urlId]) {
            if (!Array.isArray(boards[urlId].cards)) {
            boards[urlId].cards = [];
            }
            boards[urlId].cards.push(tarjeta);
        } else {
            boards[urlId] = { cards: [tarjeta] };
        }
        localStorage.setItem('boards', JSON.stringify(boards));

        title.value = '';
        description.value = '';
        dueDate.value = '';
        assignee.value = ''; 

        // BORRAR
        console.log(boards);
        const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
        if (modal)
            modal.hide();
    }
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