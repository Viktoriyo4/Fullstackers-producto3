import { socket } from './socket.js';

function getHost(){
    return "http://localhost:8080/graphql";
};

function getHostIO(){
    return "http://localhost:8080";
};

//const { exists } = require("../../models/Panel")

export async function updateTask(taskId, panelId, title, description, assignee, dueDate) {
    // const taskId = document.getElementById('taskIdUpdate').value
    // const panelId = document.getElementById('panelUpdateTaskId').value
    // const title = document.getElementById('titleUpdateTask').value
    // const description = document.getElementById('descriptionUpdateTask').value
    // const assignee = document.getElementById('assigneeUpdateTask').value
    // const dueDate = document.getElementById('dateUpdateTask').value

    console.log(taskId)
    console.log(panelId)
    console.log(title)
    console.log(description)
    console.log(assignee)
    console.log(dueDate)

    const query = `mutation($panelId: ID!, $taskId: ID!, $title: String!, $description: String!, $assignee: String!, $dueDate: String!) {
        updateTask(panelId: $panelId, id: $taskId, title: $title, description: $description, assignee: $assignee, dueDate: $dueDate) {
          id,
          title,
          description,
          dueDate,
          assignee,
          columnId,
        }
    }`

    try {
        const response = await fetch(getHost(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query,
                variables: {
                    panelId: panelId,
                    taskId: taskId,
                    title: title,
                    description: description,
                    assignee: assignee,
                    dueDate: dueDate,
                },
            })
        });

        if (!response.ok){
            const errorMessage = await response.text();
            throw new Error(`Error status: ${response.status}, message: ${errorMessage}`);
        }

        const result = await response.json();

        socket.emit("updateTask", result.data.updateTask);

    } catch (error){
        console.log(error)
    }
}

export async function addPanel({name, dueno, descripcion}) {
    const query = `mutation($name: String!, $dueno: String!, $descripcion: String!) {
        addPanel(name: $name, dueno: $dueno, descripcion: $descripcion) {
          id,
          name,
          dueno,
          descripcion
        }
    }`

    try {
        const response = await fetch(getHost(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query,
                variables: {name, dueno, descripcion},
            })
        });

        if (!response.ok){
            const errorMessage = await response.text();
            throw new Error(`Error status: ${response.status}, message: ${errorMessage}`);
        }

        const result = await response.json();

        socket.emit("addPanel", result.data.addPanel);

        return result;
    } catch(error){
        console.log(error)
    }
}

export async function removePanel(id){
    const query = `mutation($id: ID!) {
        removePanel(id: $id) {
          id,
          name,
          dueno,
          descripcion
        }
    }`

    try {
        const response = await fetch(getHost() + '/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query,
                variables: {id},
            })
        });

        if (!response.ok){
            const errorMessage = await response.text();
            throw new Error(`Error status: ${response.status}, message: ${errorMessage}`);
        }

        const result = await response.json();

        socket.emit("removePanel", id);

        return result;

    } catch(error){
        console.log(error)
    }
}

export async function getPanels(){
    const query = `query Panels {
        panels {
          id
          name
          dueno
          descripcion
        }
      }`

    try {
        const response = await fetch(getHost(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({query})
        });

        if (!response.ok){
            const errorMessage = await response.text();
            throw new Error(`Error status: ${response.status}, message: ${errorMessage}`);
        }

        const result = await response.json();
        return result;        
    } catch(error){
        console.log(error)
    }
}

export async function getPanel(id){
    const query = `query Query($id: ID!) {
                    panel(id: $id) {
                        id
                        name
                        dueno
                        descripcion
                        tasks {
                        id
                        title
                        description
                        dueDate
                        assignee
                        columnId
                        }
                    }
                }`

    try {
        const response = await fetch(getHost(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query, 
                variables: {id}
            })
        });

        if (!response.ok){
            const errorMessage = await response.text();
            throw new Error(`Error status: ${response.status}, message: ${errorMessage}`);
        }

        const result = await response.json();
        return result;
    } catch(error){
        console.log(error)
    }
}

export async function addTask({panelId, title, description, date, assignee, columnId}, boardId) {
    const query = `mutation($panelId: ID!, $title: String!, $description: String!, $date: String!, $assignee: String!, $columnId: ID!) {
        addTask(panelId: $panelId, title: $title, description: $description, dueDate: $date, assignee: $assignee, columnId: $columnId) {
          id,
          title,
          description,
          dueDate,
          assignee,
          columnId,
        }
    }`

    try {
        const response = await fetch(getHost(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query,
                variables: {
                    panelId: panelId,
                    title: title,
                    description: description,
                    date: date.toString(),
                    assignee: assignee, 
                    columnId: columnId,
                },
            })
        });

        if (!response.ok){
            const errorMessage = await response.text();
            throw new Error(`Error status: ${response.status}, message: ${errorMessage}`);
        }

        const result = await response.json();
   
        socket.emit("addTask", {task: result.data.addTask, boardId: boardId});

        return result;        
    } catch(error){
        console.log(error)
    }
}

socket.on("taskAdded", arg => {
    console.log("Added: ", arg)
})

export async function changeTaskColumn(panelId, taskId, columnId, dropTargetId) {
    // const panelId = document.getElementById('panelIdChangeTaskColumn').value
    // const columnId = document.getElementById('changeColumnId').value
    // const taskId = document.getElementById('taskIdChangeColumn').value

    const query = `mutation($panelId: ID!, $taskId: ID!, $columnId: ID!) {
        changeTaskColumn(panelId: $panelId, id: $taskId, columnId: $columnId) {
          id,
          title,
          description,
          dueDate,
          assignee,
          columnId,
        }
    }`
    
    try {
        const response = await fetch(getHost(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query,
                variables: {
                    panelId: panelId,
                    taskId: taskId,
                    columnId: columnId,
                },
            })
        });

        if (!response.ok){
            const errorMessage = await response.text();
            throw new Error(`Error status: ${response.status}, message: ${errorMessage}`);
        }

        const result = await response.json();

        socket.emit("changeTaskColumn", {task: result.data.changeTaskColumn, dropTargetId: dropTargetId});

        return result;
    } catch (error){
        console.log(error)
    }
}


export async function removeTask(panelId, taskId) {
    const query = `mutation RemoveTask($panelId: ID!, $taskId: ID!) {
                    removeTask(panelId: $panelId, id: $taskId) {
                        id
                        title
                        description
                        dueDate
                        assignee
                        columnId
                    }
                }`
    
    try {
        const response = await fetch(getHost(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                query,
                variables: {
                    panelId: panelId,
                    taskId: taskId,
                },
            })
        });

        const result = await response.json()

        socket.emit("removeTask", {panelId: panelId, taskId: taskId});

        return result;
    }
    catch (error){
        console.log(error)
    }
}

  //TODO: For panel update. For files update.