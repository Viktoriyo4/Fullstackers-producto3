import { addPanel, getPanels, removeTask, removePanel} from './querisFr.js';

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
        const boardList = document.getElementById('boardList');
        const boardItem = document.getElementById(`'${boardId}'`);
        if (boardItem) {
            boardList.removeChild(boardItem);
        }
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
                    <a href="tablero.html?id=${panel.id}&name=${encodeURIComponent(panel.name)}" class="btn btn-link">Abrir</a>
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

    // for (let id in boards) {
    //     const boardName = boards[id].name;

    //     // Crea un elemento en la lista de tableros
    //     const boardList = document.getElementById('boardList');
    //     const creationDate = boards[id].creationDate; 
    //     const boardItem = document.createElement('div');
    //     boardItem.className = 'col-12 col-md-6 col-lg-4 cust alert alert-info alert-dismissible fade show mt-2 d-flex justify-content-between align-items-center';
    //     boardItem.setAttribute('data-id', id);
    //     boardItem.innerHTML = `
    //         <h3 class="truncate flex-grow-1">${boardName}</h3>
    //          <p class="mb-0">${creationDate}</p>
    //         <div class="d-flex align-items-center">
    //             <a href="tablero.html?id=${id}&name=${encodeURIComponent(boardName)}" class="btn btn-link">Abrir</a>
    //             <button type="button" class="btn-close cerrar ms-2" aria-label="Close" onclick="deleteBoard(${id})"></button>
    //         </div>
    //     `;
    //     boardList.appendChild(boardItem);
    // }
};



