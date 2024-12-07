// Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
import { changeTaskColumn } from './querisFr.js';
import { socket } from './socket.js';

// HTML DOM Element, a task
let draggedTask = null;

// ondragstart event listener: sets dragged if a "task" is being drag
ondragstart = (event) => {  
    if (event.target.classList.contains("task"))
        draggedTask = event.target;
};

// ondragover event listener. If not present, the browser will default to doing nothing
ondragover = (event) => {
    event.preventDefault();
};

// ondrop event listener.
ondrop = (event) => {
    // Necessary to override browser default
    event.preventDefault();

    // DOM element variable
    let dropTarget = event.target;

    // Searchs the tree upwards until it finds a "task" or tasks column, "tasks".
    while (dropTarget && !(dropTarget.classList.contains("tasks") || dropTarget.classList.contains("task"))) {
        dropTarget = dropTarget.parentNode;
    }

    // If not found or it's the dragged element, exits
    if (!dropTarget || dropTarget === draggedTask) {
        return ;
    }

    let targetColumn;
    if (dropTarget.classList.contains("tasks")) {
        targetColumn = dropTarget.id
        draggedTask.parentNode.removeChild(draggedTask);
        dropTarget.appendChild(draggedTask);
    } else if (dropTarget.classList.contains("task")) {
        targetColumn = dropTarget.parentNode.id
        draggedTask.parentNode.removeChild(draggedTask);
        dropTarget.insertAdjacentElement("beforebegin", draggedTask);
    }
    
    moverLS(draggedTask.id, targetColumn, dropTarget);

    draggedTask = null;
};

async function moverLS(taskId, targetColumn, dropTarget){
    const para = new URLSearchParams(window.location.search);
    const urlId = para.get('id');

    let idColumna=1;
    if(targetColumn=="todo-tasks"){
        idColumna=1;
    }else if(targetColumn=="doing-tasks"){
        idColumna=2;
    }else if(targetColumn=="done-tasks"){
        idColumna=3;
    }
    
    const result = await changeTaskColumn(urlId, taskId, idColumna, dropTarget.id);
}  

socket.on("taskColumnChanged", (arg) => {
    console.log(arg)
    let dropTarget = document.getElementById(arg.topTaskID)
    let task = document.getElementById(arg.id)
    console.log(dropTarget, task)
    if (task){
        if (dropTarget.classList.contains("tasks")) {
            task.parentNode.removeChild(task);
            dropTarget.appendChild(task);
        } else if (dropTarget.classList.contains("task")) {
            task.parentNode.removeChild(task);
            dropTarget.insertAdjacentElement("beforebegin", task);
        }
    }
})