// INTERFAZ 3: Drag & Drop de tareas entre columnas
// INTERFAZ 3: Modificación dinámica de subelementos

import { updateTask, addFile, getFile, removeFile, getCodeSandboxHost } from "./querisFr.js";
import { socket } from "./socket.js";
import { formatoDueDate } from "./Interfaz1.js";
import { generateFileHash } from "./Interfaz2.js";

// Esta variable almacenará la tarea a editar
let taskToEdit = "";
let archivosEditar = [];

document
  .getElementById("uploadButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("subirDocEd").click();
  });

function editTask(taskId) {
  archivosEditar = [];
  const lista = document.getElementById("listaArchivosEditar");
  lista.innerHTML = "";
  taskToEdit = taskId;
  const taskElement = document.getElementById(taskId);

  // Rellenar el modal con los datos de la tarea
  document.getElementById("editTaskTitle").value = document.getElementById(
    "titulo-" + taskToEdit
  ).innerText;
  document.getElementById("editTaskDescription").value =
    document.getElementById("desc-" + taskToEdit).innerText;
  const rawDate = document
    .getElementById("fechalim-" + taskToEdit)
    .innerText.split(": ")[1];
  const [year, month, day] = rawDate.split("-");
  const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;
  document.getElementById("editTaskDueDate").value = formattedDate;

  // document.getElementById('editTaskDueDate').value = taskElement.querySelectorAll('p')[1].innerText.split(': ')[1];
  document.getElementById("editTaskAssignee").value = document
    .getElementById("resp-" + taskToEdit)
    .innerText.split(": ")[1];

  // Mostrar el modal
  const modal = new bootstrap.Modal(document.getElementById("editTaskModal"));
  modal.show();
}

function gestionarArchivos(event) {
  const nuevosArchivos = event.target.files;
  const inputFile = document.getElementById("subirDocEd");

  for (let i = 0; i < nuevosArchivos.length; i++) {
    archivosEditar.push(nuevosArchivos[i]);
  }

  inputFile.value = "";

  const lista = document.getElementById("listaArchivosEditar");

  mostrarArchivos(lista, archivosEditar);
}

function mostrarArchivos(lista, archivos) {
  lista.innerHTML = "";

  archivos.forEach((archivo, index) => {
    const listaArchivo = document.createElement("li");
    const botonEliminar = document.createElement("button");
    botonEliminar.innerText = "Cancelar";
    botonEliminar.classList.add("btn", "btn-primary", "btn-sm", "ms-2");
    botonEliminar.onclick = function () {
      eliminarArchivo(index, lista, archivos);
    };
    listaArchivo.id = `arch-${index}`;
    const sizeArch = (archivo.size / 1024).toFixed(2);
    const archivoTexto = `${archivo.name} (${sizeArch} KB)`;

    listaArchivo.innerText = archivoTexto;
    listaArchivo.appendChild(botonEliminar);

    lista.appendChild(listaArchivo);
  });
}

function eliminarArchivo(index, lista, archivos) {
  archivos.splice(index, 1);
  mostrarArchivos(lista, archivos);
}

async function guardarArchivo(archivo, panelId, taskId) {
  const formData = new FormData();
  formData.append("file", archivo);
  formData.append("filename", archivo.name);

  try {
    const response = await fetch("https://"+ getCodeSandboxHost(8080) +"/assets", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    let arch = await addFile({
      panelId: panelId,
      taskId: taskId,
      filename: data.filename,
      url: data.url,
      size: data.size,
      mimetype: data.mimetype,
    });
    let datos = arch.data.addFile;
    return arch;
  } catch (error) {
    console.error(error);
  }
}

function printArch(arch, filename, size, taskId, panelId) {
  //    console.log(arch, filename, size, taskId, panelId)

  const cnt = document.getElementById("cnt-arch-" + taskId);
  const archCnt = document.createElement("div");
  archCnt.id = `arch-${arch.id}`;
  archCnt.classList.add(
    "d-flex",
    "justify-content-between",
    "align-items-center",
    "mt-2"
  );
  const nombre = document.createElement("p");
  nombre.innerText = filename + " (" + size + " KB)";
  archCnt.appendChild(nombre);

  const btnDesc = document.createElement("button");
  btnDesc.innerText = "Descargar";
  btnDesc.classList.add("btn", "btn-primary", "btn-sm", "ms-2");
  btnDesc.onclick = function () {
    descargarArch(arch.id, taskId, panelId);
  };
  archCnt.appendChild(btnDesc);
  const btnElim = document.createElement("button");
  btnElim.innerText = "Eliminar";
  btnElim.classList.add("btn", "btn-danger", "btn-sm", "ms-2");
  btnElim.onclick = function () {
    borrarArchModal(arch.id, taskId, panelId);
  };
  archCnt.appendChild(btnElim);
  cnt.appendChild(archCnt);
}

function borrarArchModal(archId, taskId, panelId) {
  const modal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModalArch")
  );

  document.getElementById("archIdField").value = archId;
  document.getElementById("taskIdField").value = taskId;
  document.getElementById("panelIdField").value = panelId;

  modal.show();
}

async function borrarArch() {
  const archId = document.getElementById("archIdField").value;
  const taskId = document.getElementById("taskIdField").value;
  const panelId = document.getElementById("panelIdField").value;
  //Aqui la función de eliminar pero tenemos de buscar el archivo en la bbdd
  try {
    await removeFile({
      id: archId,
      taskId: taskId,
      panelId: panelId,
    });
  } catch (error) {
    console.error(error);
    return;
  }

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("confirmDeleteModalArch")
  );
  modal.hide();
}

window.borrarArch = borrarArch;

async function descargarArch(archId, taskId, panelId) {
  //Aqui la función de descargar pero tenemos de buscar el archivo en la bbdd
  let file = await getFile({
    fileId: archId,
    taskId: taskId,
    panelId: panelId,
  });
  try {
    let url = `https://${getCodeSandboxHost(8080)}/download?url=${file.data.file.url}&name=${file.data.file.filename}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = file.data.file.filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  } catch (error) {
    console.error(error);
  }
}

function comprobar(editado, anterior) {
  if (editado.value == "") {
    editado.classList.add("is-invalid");
    //        console.log("Relleno el campo");
    return false;
  } else {
    anterior = editado.value;
    editado.classList.remove("is-invalid");
    return true;
  }
}

document.getElementById("cerrarModalEd").addEventListener("click", function () {
  document.getElementById("editTaskTitle").classList.remove("is-invalid");
  document.getElementById("editTaskDescription").classList.remove("is-invalid");
  document.getElementById("editTaskAssignee").classList.remove("is-invalid");
});

window.editTask = editTask;
window.gestionarArchivos = gestionarArchivos;

document
  .getElementById("editTaskForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const taskElement = document.getElementById(taskToEdit);
    let volver = false;
    if (taskElement) {
      volver =
        comprobar(
          document.getElementById("editTaskTitle"),
          document.getElementById("titulo-" + taskToEdit).innerText
        ) &&
        comprobar(
          document.getElementById("editTaskDescription"),
          document.getElementById("desc-" + taskToEdit).innerText
        ) &&
        comprobar(
          document.getElementById("editTaskAssignee"),
          document.getElementById("resp-" + taskToEdit).innerText
        );
      document.getElementById(
        "fechalim-" + taskToEdit
      ).innerText = `Fecha límite: ${
        document.getElementById("editTaskDueDate").value
      }`;
    }
    if (!volver) {
      return;
    }

    const para = new URLSearchParams(window.location.search);
    const urlId = para.get("id");
    for (let [index, archivo] of archivosEditar.entries()) {
      await guardarArchivo(archivo, urlId, taskToEdit);
    }

    const lista = document.getElementById("listaArchivosEditar");
    lista.innerHTML = "";
    archivosEditar = [];
    updateTask(
      taskToEdit,
      urlId,
      document.getElementById("editTaskTitle").value,
      document.getElementById("editTaskDescription").value,
      document.getElementById("editTaskAssignee").value,
      document.getElementById("editTaskDueDate").value
    );

    // Cerrar el modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("editTaskModal")
    );
    modal.hide();
  });

socket.on("taskUpdated", (arg) => {
  const taskElement = document.getElementById(arg.id);
  if (taskElement) {
    taskElement.querySelector("h5").innerText = arg.title; // Title
    taskElement.querySelector("p").innerText = arg.description; // Description
    taskElement.querySelectorAll(
      "p"
    )[1].innerText = `Fecha límite: ${arg.dueDate}`; // Due date
    taskElement.querySelectorAll(
      "p"
    )[2].innerText = `Responsable: ${arg.assignee}`; // Assignee
  }
});

socket.on("fileAdded", (args) => {
  const para = new URLSearchParams(window.location.search);
  const urlId = para.get("id");

  if (args.panelId == urlId) {
    printArch(args, args.filename, args.size, args.taskId, args.panelId);

    const adj = document.getElementById(`adj-${args.taskId}`);
    const content = adj.textContent.trim();
    const number = parseInt(content.match(/\d+/)[0]);
    adj.innerText = `${number + 1}📎`;
  }
});

socket.on("fileRemoved", (args) => {
  const para = new URLSearchParams(window.location.search);
  const urlId = para.get("id");

  if (args.panelId == urlId) {
    const arch = document.getElementById(`arch-${args.id}`);
    arch.remove();
    const adj = document.getElementById(`adj-${args.taskId}`);
    const content = adj.textContent.trim();
    const number = parseInt(content.match(/\d+/)[0]);
    adj.innerText = `${number - 1}📎`;
  }
});

export { printArch, mostrarArchivos, guardarArchivo };
