import { addPanel, getPanels, removeTask, removePanel, updatePanel} from './querisFr.js';

let boardCount = 0;
let boardToEdit = 0;

function validarDatos(elemento){
    if (!elemento.value) {
        elemento.classList.add('is-invalid');
        return false;
    } else {
        elemento.classList.remove('is-invalid');
        return true;
    }
}

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
            const boardList = document.getElementById('boardList');
            const boardItem = document.createElement('div');
            boardItem.className = 'alert alert-info alert-dismissible fade show mt-2';
            boardItem.setAttribute('id', nuevoPanel.id);
            boardItem.innerHTML = `
                <h1>${nuevoPanel.name}</h1>
                    
                <button type="button" class="btn-close" aria-label="Close" onclick="deleteBoard('${nuevoPanel.id}')"></button>
                <a href="tablero.html?id=${nuevoPanel.id}&name=${encodeURIComponent(nuevoPanel.name)}" class="btn btn-link">Abrir</a>
                <a onclick="updateBoard('${nuevoPanel.id}')" class="btn btn-link">Editar</a>
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

// Funcion para editar un tablero
document.getElementById('editBoardModal').addEventListener('submit', async function(event) {
    event.preventDefault();
    let valid = true;
    const id = boardToEdit
    const nameEl = document.getElementById('editBoardName')
    const descEl = document.getElementById('editBoardDescripcion')
    const duenoEl = document.getElementById('editBoardDueno')

    valid = validarDatos(nameEl) && validarDatos(duenoEl) && validarDatos(descEl)
    if (valid){
        const name = nameEl.value
        const dueno = duenoEl.value
        const descripcion = descEl.value
    
        const result = await updatePanel({id, name, dueno, descripcion})
        const panel = document.getElementById(result.data.updatePanel.id)
        if (panel){
            panel.children[0].innerText = result.data.updatePanel.name
            panel.children[1].querySelector('span').innerText =  result.data.updatePanel.descripcion
            panel.children[2].querySelector('span').innerText =  result.data.updatePanel.dueno
        }
    }
})

window.deleteBoard = deleteBoard;

// Función para manejar la eliminación de un tablero
async function deleteBoard(boardId) {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este tablero?");
    if(confirmDelete){
        const result = await removePanel(boardId);
        const boardList = document.getElementById('boardList');
        const boardItem = document.querySelector(`[id="${boardId}"]`);
        if (boardItem) {
            boardList.removeChild(boardItem);
       }
    }
}

// Modal
async function updateBoard(id) {
    const editName = document.getElementById('editBoardName');
    const editDueno = document.getElementById('editBoardDueno');
    const editDesc = document.getElementById('editBoardDescripcion');

    editName.classList.remove('is-invalid')
    editDueno.classList.remove('is-invalid')
    editDesc.classList.remove('is-invalid')

    const panel = document.getElementById(id)
    boardToEdit = id
    editName.value = panel.children[0].innerText
    editDesc.value = panel.children[1].querySelector('span').innerText
    editDueno.value = panel.children[2].querySelector('span').innerText
    const modal = new bootstrap.Modal(document.getElementById('editBoardModal'));
    modal.show();
}

window.updateBoard = updateBoard

// Carga los tableros existentes al cargar la página
window.onload = async function() {
    try{
        const response = await getPanels();
        if(response){
            const boardList = document.getElementById('boardList');
            response.data.panels.forEach(panel => {
                const boardItem = document.createElement('div');
                boardItem.className = 'alert alert-info alert-dismissible fade show mt-2';
                boardItem.setAttribute('id', panel.id);
                boardItem.innerHTML = `
                    <h1>${panel.name}</h1>
                    <p class="hidden">descripcion: <span>${panel.descripcion}</span></p>
                    <p class="hidden">dueño: <span>${panel.dueno}</span></p>
                    <button type="button" class="btn-close" aria-label="Close" onclick="deleteBoard('${panel.id}')"></button>
                    <a href="/Html/tablero.html?id=${panel.id}&name=${encodeURIComponent(panel.name)}" class="btn btn-link">Abrir</a>
                    <a onclick="updateBoard('${panel.id}')" class="btn btn-link">Editar</a>
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



