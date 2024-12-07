// INTERFAZ 3: Drag & Drop de tareas entre columnas
// INTERFAZ 3: Modificación dinámica de subelementos


import { updateTask, addFile } from './querisFr.js';
import { generateFileHash } from './Interfaz2.js';
// Esta variable almacenará la tarea a editar
let taskToEdit = '';
let archivosEditar = [];

document.getElementById('uploadButton').addEventListener('click', function(event) {
    event.preventDefault(); 
    document.getElementById('uploadImage').click();
});



function editTask(taskId) {
    archivosEditar = [];
    const lista = document.getElementById("listaArchivosEditar");
    lista.innerHTML = '';
    taskToEdit = taskId;
    const taskElement = document.getElementById(taskId);
    
    // Rellenar el modal con los datos de la tarea
    document.getElementById('editTaskTitle').value = taskElement.querySelector('h5').innerText;
    document.getElementById('editTaskDescription').value = taskElement.querySelector('p').innerText;
    const rawDate = taskElement.querySelectorAll('p')[1].innerText.split(': ')[1];
    const [year, month, day] = rawDate.split('-');
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    document.getElementById('editTaskDueDate').value = formattedDate;

    // document.getElementById('editTaskDueDate').value = taskElement.querySelectorAll('p')[1].innerText.split(': ')[1];
    document.getElementById('editTaskAssignee').value = taskElement.querySelectorAll('p')[2].innerText.split(': ')[1];
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    modal.show();
}

function gestionarArchivos(event){
    const nuevosArchivos = event.target.files;
    const inputFile = document.getElementById("uploadImage");

    for(let i = 0 ; i < nuevosArchivos.length ; i++){
        archivosEditar.push(nuevosArchivos[i]);
    }

    inputFile.value = '';

    const lista = document.getElementById("listaArchivosEditar");

    mostrarArchivos(lista);
}

function mostrarArchivos(lista){
    lista.innerHTML = '';

    archivosEditar.forEach((archivo,index) =>{
        const listaArchivo = document.createElement("li");
        const botonEliminar = document.createElement("button");
        botonEliminar.innerText = "Eliminar";
        botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
        botonEliminar.onclick = function(){
            eliminarArchivo(index);
        }
        listaArchivo.id = `arch-${index}`;
        const sizeArch = (archivo.size / 1024).toFixed(2);
        const archivoTexto = `${archivo.name} (${sizeArch} KB)`;  
        
        listaArchivo.innerText = archivoTexto; 
        listaArchivo.appendChild(botonEliminar);
        
        lista.appendChild(listaArchivo);
    });    
}

function eliminarArchivo(index){
    archivosEditar.splice(index,1);
    const lista = document.getElementById("listaArchivosEditar");
    mostrarArchivos(lista);
}

async function guardarArchivo(archivo, panelId, taskId){
    const formData = new FormData();
    formData.append('file', archivo);
    formData.append('filename', archivo.name);

    try {
        const response = await fetch('http://localhost:8080/assets/', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        let arch = await addFile({
            panelId: panelId,
            taskId: taskId,
            filename: data.filename,
            url: data.url,
            size: data.size,
            mimetype: data.mimetype
        });
        return printArch(arch, data.filename, data.size, taskId, panelId);

    } catch (error) {
        console.error(error);
    }
}

function printArch(arch, filename, size, taskId, panelId){
    console.log("el arch ↓");
    console.log(arch);
    const cnt = document.getElementById('cnt-arch-'+taskId);
    const archCnt = document.createElement('div');
    archCnt.id = `arch-${arch.id}`;
    archCnt.classList.add("d-flex", "justify-content-between", "align-items-center", "mt-2");
    const nombre = document.createElement('p');
    nombre.innerText = filename + " (" + size + " KB)";
    archCnt.appendChild(nombre);

    const btnDesc = document.createElement('button');
    btnDesc.innerText = "Descargar";
    btnDesc.classList.add("btn", "btn-primary", "btn-sm", "ms-2");
    btnDesc.onclick = function(){
        descargarArch(arch.id, taskId, panelId);
    }
    archCnt.appendChild(btnDesc);
    const btnElim = document.createElement('button');
    btnElim.innerText = "Eliminar";
    btnElim.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
    btnElim.onclick = function(){
        borrarArch(arch.id, taskId, panelId);
    }
    archCnt.appendChild(btnElim);
    cnt.appendChild(archCnt);
}

function borrarArch(archId, taskId, panelId){
    //Aqui la función de eliminar pero hemos de buscar el archivo en la bbdd
    console.log("HOLA");
}

function descargarArch(archId, taskId, panelId){
    //Aqui la función de descargar pero hemos de buscar el archivo en la bbdd
    console.log("HOLA");
}

window.editTask = editTask;
window.gestionarArchivos = gestionarArchivos;

document.getElementById('editTaskForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const taskElement = document.getElementById(taskToEdit);

    if (taskElement) {
        document.getElementById('titulo-'+taskToEdit).innerText = document.getElementById('editTaskTitle').value;
        document.getElementById('desc-'+taskToEdit).innerText = document.getElementById('editTaskDescription').value;
        document.getElementById('fechalim-'+taskToEdit).innerText = document.getElementById('editTaskDueDate').value;
        document.getElementById('resp-'+taskToEdit).innerText = document.getElementById('editTaskAssignee').value;
    }
    
    const para = new URLSearchParams(window.location.search);
    const urlId = para.get('id');
    for(let [index, archivo] of archivosEditar.entries()){
         await guardarArchivo(archivo, urlId, taskToEdit);
    };
    
    const lista = document.getElementById("listaArchivosEditar");
    lista.innerHTML = '';
    archivosEditar = [];
    updateTask(taskToEdit, urlId, document.getElementById('editTaskTitle').value, document.getElementById('editTaskDescription').value, document.getElementById('editTaskAssignee').value, document.getElementById('editTaskDueDate').value);

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
    modal.hide();
});

export { printArch }
