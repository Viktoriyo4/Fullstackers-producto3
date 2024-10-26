// INTERFAZ 2: Validación y creación de tareas

const createTaskModal = document.getElementById("addTaskModal");

let buttonColumnSource = null;

createTaskModal.addEventListener("show.bs.modal", (event) => {
    buttonColumnSource = event.relatedTarget.getAttribute("data-click-source");
});

const form = document.getElementById('taskForm');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir envío por defecto
    let isValid = true;

    // Validar título
    const title = document.getElementById('taskTitle');
    if (!title.value) {
        title.classList.add('is-invalid');
        isValid = false;
    } else {
        title.classList.remove('is-invalid');
    }

    // Validar descripción
    const description = document.getElementById('taskDescription');
    if (!description.value) {
        description.classList.add('is-invalid');
        isValid = false;
    } else {
        description.classList.remove('is-invalid');
    }

    // Validar fecha
    const dueDate = document.getElementById('taskDueDate');
    if (!dueDate.value) {
        dueDate.classList.add('is-invalid');
        isValid = false;
    } else {
        dueDate.classList.remove('is-invalid');
    }

    // Validar responsable
    const assignee = document.getElementById('taskAssignee');
    if (!assignee.value) {
        assignee.classList.add('is-invalid');
        isValid = false;
    } else {
        assignee.classList.remove('is-invalid');
    }

    // Si todo es válido, crear nueva tarea
    if (isValid) { 
        var idColumnaSw=0;
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
        if (!boards[urlId].cards || boards[urlId].cards.length === 0) {
            newTask.id = '0'; 
        } else {
            newTask.id = `${boards[urlId].cards.length}`;
        }

        newTask.innerHTML = `
            <h5 class="titulo">${title.value}</h5>
            <p class="descripcion">${description.value}</p>
            <p>Fecha límite: ${dueDate.value}</p>
            <p class="responsable">Responsable: ${assignee.value}</p> <!-- Añadir el responsable -->
            <button onclick="confirmDelete('${newTask.id}')" class="btn btn-danger btn-sm">Eliminar</button>
            <button onclick="editTask('${newTask.id}')" class="btn btn-warning btn-sm">Editar</button>
        `;

        taskList.appendChild(newTask); // Agregar tarea a la column

        console.log('ID del tablero:', urlId);
        const tarjeta ={
            id: newTask.id,
            title: title.value,
            description: description.value,
            dueDate: dueDate.value,
            assignee: assignee.value,
            idColumna: idColumnaSw,
        }
        if (boards[urlId]) {
            if (!Array.isArray(boards[urlId].cards)) {
            boards[urlId].cards = [];
            }
            boards[urlId].cards.push(tarjeta);
        } else {
            boards[urlId] = { cards: [tarjeta] };
        }
        localStorage.setItem('boards', JSON.stringify(boards));
        // Reiniciar formulario
        title.value = '';
        description.value = '';
        dueDate.value = '';
        assignee.value = ''; 

        // Verifica que los valores sean correctos
        console.log(boards);
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
        if (modal)
            modal.hide();
    }
});
