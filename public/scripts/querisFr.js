//const { exists } = require("../../models/Panel")

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
        const response = await fetch('http://localhost:8080/graphql', {
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
        console.log("Added: ", result.data.addPanel);
        return result;

    } catch(error){
        console.log(error)
    }
}

async function removePanel(){
    const id = document.getElementById('panelId').value

    const query = `mutation($id: ID!) {
        removePanel(id: $id) {
          id,
          name,
          dueno,
          descripcion
        }
    }`

    try {
        const response = await fetch('http://localhost:8080/graphql', {
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
        console.log("Removed: ", result.data);

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
        const response = await fetch('http://localhost:8080/graphql', {
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
        const response = await fetch('http://localhost:8080/graphql', {
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

export async function addTask({panelId, title, description, date, assignee, columnId}) {
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
        const response = await fetch('http://localhost:8080/graphql', {
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
        return result;
        // console.log("Added: ", result.data);
    } catch(error){
        console.log(error)
    }
}

async function changeTaskColumn(){
    const panelId = document.getElementById('panelIdChangeTaskColumn').value
    const columnId = document.getElementById('changeColumnId').value
    const taskId = document.getElementById('taskIdChangeColumn').value
    
    console.log(panelId)
    console.log(columnId)
    console.log(taskId)

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
        const response = await fetch('http://localhost:8080/graphql', {
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
        console.log("Changed column: ", result.data);

    } catch (error){
        console.log(error)
    }
}

async function removeTask(){
    const panelId = document.getElementById('panelIdDeleteTask').value
    const taskId = document.getElementById('deleteTaskId').value

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
        const response = await fetch('http://localhost:8080/graphql', {
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
        console.log("Deleted: ", result.data)
    }
    catch (error){
        console.log(error)
    }
}