// INTERFAZ 1: Eliminación de tareas y carga de tareas

import { getPanel, removeTask } from "./querisFr.js";
import { socket } from "./socket.js";
import { printArch } from "./Interfaz3.js";

let taskToDelete = "";

function confirmDelete(taskId) {
  taskToDelete = taskId;
  const modal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  modal.show();
}

window.confirmDelete = confirmDelete;

document
  .getElementById("confirmDeleteButton")
  .addEventListener("click", function () {
    const taskElement = document.getElementById(taskToDelete);

    const para = new URLSearchParams(window.location.search);
    const urlId = para.get("id");

    if (urlId && taskElement) {
      removeTask(urlId, taskToDelete);
    }

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("confirmDeleteModal")
    );
    modal.hide();
  });

// socket - remove task
socket.on("taskRemoved", (arg) => {
  let task = document.getElementById(arg.id);
  if (task) {
    task.remove();
  }
});

window.onload = async function () {
  const listaTodo = document.getElementById("todo-tasks");
  const listaDoing = document.getElementById("doing-tasks");
  const listaDone = document.getElementById("done-tasks");

  const para = new URLSearchParams(window.location.search);
  const urlId = para.get("id");

  try {
    const response = await getPanel(urlId);
    if (response) {
      response.data.panel.tasks.forEach((carta) => {
        const nuevaTarea = document.createElement("div");
        nuevaTarea.className = "task card p-2 mb-2";
        nuevaTarea.draggable = true;
        nuevaTarea.ondragstart = function (event) {};
        nuevaTarea.id = carta.id;

        nuevaTarea.innerHTML = `
                    <h5 id="titulo-${carta.id}" class="titulo">${
          carta.title
        }</h5>
                    <p id="desc-${carta.id}" class="descripcion">${
          carta.description
        }</p>
                    <p id="fechalim-${carta.id}">Fecha límite: ${formatoDueDate(
          carta.dueDate
        )}</p>
                    <p id="resp-${carta.id}" class="responsable">Responsable: ${
          carta.assignee
        }</p>
                    <span id="adj-${carta.id}"> 0📎</span>
                    <div id="cnt-arch-${carta.id}">

                    </div> 
                    <button onclick="confirmDelete('${
                      carta.id
                    }')" class="btn btn-danger btn-sm">Eliminar</button>
                    <button onclick="editTask('${
                      carta.id
                    }')" class="btn btn-warning btn-sm">Editar</button>
                `;
        switch (carta.columnId) {
          case "1":
            listaTodo.appendChild(nuevaTarea);
            break;
          case "2":
            listaDoing.appendChild(nuevaTarea);
            break;
          case "3":
            listaDone.appendChild(nuevaTarea);
            break;
          default:
            listaTodo.appendChild(nuevaTarea);
            break;
        }
        let cant = 0;
        cant = carta.files.length;
        const adj = document.getElementById(`adj-${carta.id}`);
        adj.innerText = `${cant}📎`;
        carta.files.forEach((file) => {
          printArch(file, file.filename, file.size, carta.id, urlId);
        });
      });
    } else {
      console.error("Error al buscar el panel");
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

//fecha y hora
export function formatoDueDate(dueDate) {
  const date = new Date(parseInt(dueDate));

  if (isNaN(date.getTime())) {
    return "Fecha inválida";
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript son 0-11
  const year = date.getFullYear();

  // return `${hours}:${minutes} ${day}/${month}/${year}`;
  return `${year}-${month}-${day}`;
}

// Si el panel se elimina, salir
socket.on("panelRemoved", (arg) => {
  const para = new URLSearchParams(window.location.search);
  const urlId = para.get("id");

  if (urlId == arg) {
    window.location.href = "/";
  }
});
