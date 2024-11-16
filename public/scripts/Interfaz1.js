// INTERFAZ 1: Eliminación de tareas

import { getPanel } from './querisFr.js';

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

window.onload = async function() {
    const listaTodo = document.getElementById('todo-tasks');
    const listaDoing = document.getElementById('doing-tasks');
    const listaDone = document.getElementById('done-tasks');

    const para = new URLSearchParams(window.location.search);
    const urlId = para.get('id');

    try{
        const response = await getPanel(urlId);
        if(response){
            response.data.panel.tasks.forEach(carta => {
                const nuevaTarea = document.createElement('div');
                nuevaTarea.className = 'task card p-2 mb-2';
                nuevaTarea.draggable = true;
                nuevaTarea.ondragstart = function(event) { };
                nuevaTarea.id = carta.id;

                nuevaTarea.innerHTML = `
                    <h5 class="titulo">${carta.title}</h5>
                    <p class="descripcion">${carta.description}</p>
                    <p>Fecha límite: ${carta.dueDate}</p>
                    <p class="responsable">Responsable: ${carta.assignee}</p> <!-- Añadir el responsable -->
                    <button onclick="confirmDelete('${carta.id}')" class="btn btn-danger btn-sm">Eliminar</button>
                    <button onclick="editTask('${carta.id}')" class="btn btn-warning btn-sm">Editar</button>
                `;

                switch(carta.idColumna){
                    case 1:
                        listaTodo.appendChild(nuevaTarea);
                        break;
                    case 2:
                        listaDoing.appendChild(nuevaTarea);
                        break;
                    case 3:
                        listaDone.appendChild(nuevaTarea);
                        break;
                    default:
                        listaTodo.appendChild(nuevaTarea);
                        break;
                }
            });
        }else{
            console.error("Error al buscar el panel");
        }
    }catch(error){
        console.log(error);
        return;
    }
};



//fecha y hora
// function formatDueDate(dueDate) {
//     // Convertimos el timestamp a un objeto Date
//     const date = new Date(parseInt(dueDate));

//     // Verificamos si la fecha es válida
//     if (isNaN(date.getTime())) {
//         return "Fecha inválida";
//     }

//     // Obtenemos las partes de la fecha
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');  // Los meses en JavaScript son 0-11
//     const year = date.getFullYear();

//     // Formateamos la fecha como "hh:mm dd/MM/yyyy"
//     return `${hours}:${minutes} ${day}/${month}/${year}`;
// }