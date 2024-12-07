import { addPanel, getPanels, removeTask, removePanel} from './querisFr.js';
import { socket } from './socket.js';

let boardCount = 0;

// Función para manejar la creación de un nuevo tablero
document.getElementById('confirmCreateBoardButton').addEventListener('click', async function() {
    const newBoardName = document.getElementById('newBoardName');
    const newBoardDescripcion = document.getElementById('newBoardDescripcion');
    const newBoardDueno = document.getElementById('newBoardDueno');
    const creationDate = new Date().toLocaleDateString('es-ES');

    if (!newBoardName.value.trim()) {
        newBoardName.classList.add('is-invalid');
        document.getElementById('newBoardError').textContent = 'Por favor, ingresa un nombre para el tablero.';
        return;
    } else {
        newBoardName.classList.remove('is-invalid');
        document.getElementById('newBoardError').textContent = '';
    }

    if (!newBoardDescripcion.value.trim()) {
        newBoardDescripcion.classList.add('is-invalid');
        document.getElementById('newBoardErrorDescripcion').textContent = 'Por favor, ingresa una descripcion.';
        return;
    } else {
        newBoardDescripcion.classList.remove('is-invalid');
        document.getElementById('newBoardErrorDescripcion').textContent = '';
    }

    if (!newBoardDueno.value.trim()) {
        newBoardDueno.classList.add('is-invalid');
        document.getElementById('newBoardErrorDueno').textContent = 'Por favor, ingresa un dueño.';
        return;
    } else {
        newBoardDueno.classList.remove('is-invalid');
        document.getElementById('newBoardErrorDueno').textContent = '';
    }
    
    try{
        const response = await addPanel({
            name: newBoardName.value,
            dueno: newBoardDueno.value,
            descripcion: newBoardDescripcion.value
        });
        if(response.data.addPanel){
            const nuevoPanel = response.data.addPanel;
            console.log("Añadido: ", nuevoPanel);
            const boardList = document.getElementById('boardList');
            const boardItem = document.createElement('div');
            boardItem.className = 'alert alert-info alert-dismissible fade show mt-2';
            boardItem.setAttribute('data-id', nuevoPanel.id);
            console.log(nuevoPanel.name);
            boardItem.innerHTML = `
                <h1>${nuevoPanel.name}</h1>
                    
                <button type="button" class="btn-close" aria-label="Close" onclick="deleteBoard('${nuevoPanel.id}')"></button>
                <a href="tablero.html?id=${nuevoPanel.id}&name=${encodeURIComponent(nuevoPanel.name)}" class="btn btn-link">Abrir</a>
            `;
            boardList.appendChild(boardItem);

            // Redirigir automáticamente al nuevo tablero
            window.location.href = `tablero.html?id=${nuevoPanel.id}&name=${encodeURIComponent(nuevoPanel.name)}`;
        }else{
            console.error("Error al añadir el panel");
        }
    }catch(error){
        console.log(error);
        return;
    }
    // Cerrar modal y limpiar campo
    const modal = bootstrap.Modal.getInstance(document.getElementById('createBoardModal'));
    modal.hide();
    newBoardName.value = '';
});

window.deleteBoard = deleteBoard;

// Función para manejar la eliminación de un tablero
async function deleteBoard(boardId) {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este tablero?");
    if(confirmDelete){
        const result = await removePanel(boardId);
    }
}

// Carga los tableros existentes al cargar la página
window.onload = async function() {
    try{
        const response = await getPanels();
        if(response){
            const boardList = document.getElementById('boardList');
            response.data.panels.forEach(panel => {
                const boardItem = document.createElement('div');
                boardItem.className = 'alert alert-info alert-dismissible fade show mt-2';
                boardItem.setAttribute('data-id', panel.id);
                console.log(panel.name);
                boardItem.innerHTML = `
                    <h1>${panel.name}</h1>
                    <p class="hidden">dueño: ${panel.dueno}</p>
                    <p class="hidden">descripcion: ${panel.descripcion}</p> 
                    <button type="button" class="btn-close" aria-label="Close" onclick="deleteBoard('${panel.id}')"></button>
                    <a href="/Html/tablero.html?id=${panel.id}&name=${encodeURIComponent(panel.name)}" class="btn btn-link">Abrir</a>
                `;
                boardList.appendChild(boardItem);
            });

        }else{
            console.error("Error al añadir el panel");
        }
    }catch(error){
        console.log(error);
        return;
    }
};

// Add panel - Socket
socket.on("panelAdded", (arg) => {
    const boardItem = document.createElement('div');
    boardItem.className = 'alert alert-info alert-dismissible fade show mt-2';
    boardItem.setAttribute('data-id', arg._id);
    boardItem.innerHTML = `
        <h1>${arg.name}</h1>
        <p class="hidden">dueño: ${arg.dueno}</p>
        <p class="hidden">descripcion: ${arg.descripcion}</p> 
        <button type="button" class="btn-close" aria-label="Close" onclick="deleteBoard('${arg._id}')"></button>
        <a href="/Html/tablero.html?id=${arg._id}&name=${encodeURIComponent(arg.name)}" class="btn btn-link">Abrir</a>
    `;
    boardList.appendChild(boardItem);
})

// Eliminar panel
socket.on("panelRemoved", (arg) => {
    console.log("Recieved", arg)
    const boardList = document.getElementById('boardList');
    const boardItem = document.querySelector(`[data-id="${arg}"]`);
    if (boardItem) {
        boardList.removeChild(boardItem);
   }
})

