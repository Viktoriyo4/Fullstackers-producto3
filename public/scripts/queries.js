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
