async function addPanel(){
    const name = document.getElementById('panelName').value

    const query = `mutation($name: String!) {
        addPanel(name: $name) {
          id,
          name
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
                variables: {name},
            })
        });

        if (!response.ok){
            const errorMessage = await response.text();
            throw new Error(`Error status: ${response.status}, message: ${errorMessage}`);
        }

        const result = await response.json();
        console.log("Added: ", result.data.addPanel);

    } catch(error){
        console.log(error)
    }
}

async function removePanel(){
    const id = document.getElementById('panelId').value

    const query = `mutation($id: ID!) {
        removePanel(id: $id) {
          id,
          name
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

    const query = `query Panel($id: ID!) {
                    panel (id: $id) {
                        id
                        name
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
        
        console.log(result)
        console.log(panel)

        const panelContainer = document.getElementById('testPanels')
        const panelElement = document.createElement("panel")

        panelContainer.innerHTML = ``
        panelElement.innerHTML = `<p>id: ${panel.id} name: ${panel.name}</p>`
        panelContainer.appendChild(panelElement)

    } catch(error){
        console.log(error)
    }
}