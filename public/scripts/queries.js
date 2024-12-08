async function updateTask(){
    const taskId = document.getElementById('taskIdUpdate').value
    const panelId = document.getElementById('panelUpdateTaskId').value
    const title = document.getElementById('titleUpdateTask').value
    const description = document.getElementById('descriptionUpdateTask').value
    const assignee = document.getElementById('assigneeUpdateTask').value
    const dueDate = document.getElementById('dateUpdateTask').value

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
        console.log("Changed column: ", result.data);

    } catch (error){
        console.log(error)
    }
}

async function addPanel(){
    const name = document.getElementById('panelName').value
    const dueno = document.getElementById('panelDueno').value
    const descripcion = document.getElementById('panelDescripcion').value

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

        return
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

async function getPanels(){
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
        const panels = result.data.panels
        
        const panelContainer = document.getElementById('testPanels')
        panelContainer.innerHTML = ``
        for (let panel in panels){
            let panelData = panels[panel]
            let panelElement = document.createElement("panel");

            panelElement.innerHTML = `<p>id: ${panelData.id} name: ${panelData.name}</p>`
            
            panelContainer.appendChild(panelElement)
        }

    } catch(error){
        console.log(error)
    }
}

async function getPanel(){
    const id = document.getElementById('panelGetId').value

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
        const panel = result.data.panel
        const tasks = panel.tasks

        const panelContainer = document.getElementById('testPanels')
        const panelElement = document.createElement("panel")

        panelContainer.innerHTML = ``
        panelElement.innerHTML = `Panel:<br> id: ${panel.id} name: ${panel.name}<br> Tasks:<br>`
        panelContainer.appendChild(panelElement)

        for (let task in tasks){
            let taskElement = document.createElement("task")
            taskElement.innerHTML = JSON.stringify(tasks[task])
            panelElement.appendChild(taskElement)
        }

    } catch(error){
        console.log(error)
    }
}

async function addTask(){
    const panelId = document.getElementById('panelTaskId').value
    const title = document.getElementById('titleTask').value
    const description = document.getElementById('descriptionTask').value
    const date = document.getElementById('dateTask').value
    const assignee = document.getElementById('assigneeTask').value
    const columnId = document.getElementById('columnIdTask').value

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
        return
    } catch(error){
        console.log(error)
    }
}

async function changeTaskColumn(){
    const panelId = document.getElementById('panelIdChangeTaskColumn').value
    const columnId = document.getElementById('changeColumnId').value
    const taskId = document.getElementById('taskIdChangeColumn').value

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