const REGEX = /(?<id>\w{5,6})-(?<port>\d{1,5})\.(?<hostname>.*)/;

export function getCodeSandboxHost(port) {
  if (typeof window === "undefined") {
    if (!process.env.CSB) {
      return undefined;
    }

    const hostname = require("os").hostname();

    return `${hostname}-${port}.${process.env.CSB_BASE_PREVIEW_HOST}`;
  }

  if (typeof location === "undefined") {
    return undefined;
  }

  const currentUrl = location.host;
  const currentMatch = currentUrl.match(REGEX);

  if (!currentMatch?.groups) {
    return undefined;
  }
  const { id, hostname } = currentMatch.groups;

  if (!id || !port || !hostname) {
    return undefined;
  }

  return `${id}-${port}.${hostname}`;
}

function getHost() {
  return "https://" + getCodeSandboxHost(8080) + "/graphql";
}

export async function updateTask(
  taskId,
  panelId,
  title,
  description,
  assignee,
  dueDate
) {
  const query = `mutation($panelId: ID!, $taskId: ID!, $title: String!, $description: String!, $assignee: String!, $dueDate: String!) {
        updateTask(panelId: $panelId, id: $taskId, title: $title, description: $description, assignee: $assignee, dueDate: $dueDate) {
          id,
          title,
          description,
          dueDate,
          assignee,
          columnId,
        }
    }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error status: ${response.status}, message: ${errorMessage}`
      );
    }

    const result = await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function addPanel({ name, dueno, descripcion }) {
  const query = `mutation($name: String!, $dueno: String!, $descripcion: String!) {
        addPanel(name: $name, dueno: $dueno, descripcion: $descripcion) {
          id,
          name,
          dueno,
          descripcion
        }
    }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { name, dueno, descripcion },
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error status: ${response.status}, message: ${errorMessage}`
      );
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePanel({ id, name, dueno, descripcion }) {
  const query = `mutation($id: ID!, $name: String!, $dueno: String!, $descripcion: String!) {
        updatePanel(id: $id, name: $name, dueno: $dueno, descripcion: $descripcion) {
          id,
          name,
          dueno,
          descripcion
        }
    }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { id, name, dueno, descripcion },
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error status: ${response.status}, message: ${errorMessage}`
      );
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function removePanel(id) {
  const query = `mutation($id: ID!) {
        removePanel(id: $id) {
          id,
          name,
          dueno,
          descripcion
        }
    }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { id },
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error status: ${response.status}, message: ${errorMessage}`
      );
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getPanels() {
  const query = `query Panels {
        panels {
          id
          name
          dueno
          descripcion
        }
      }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error status: ${response.status}, message: ${errorMessage}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getFile({ fileId, taskId, panelId }) {
  const query = `query($fileId: ID!, $taskId: ID!, $panelId: ID!) {
        file(fileId: $fileId, taskId: $taskId, panelId: $panelId) {
          filename,
          url,
        }
    }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          fileId: fileId,
          taskId: taskId,
          panelId: panelId,
        },
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error status: ${response.status}, message: ${errorMessage}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function getPanel(id) {
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
                        files   {
                            id
                            filename
                            url
                            size
                            mimetype
                            }
                        }
                    }
                }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { id },
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error status: ${response.status}, message: ${errorMessage}`
      );
    }

    const result = await response.json();
    //        console.log("EL RESUUUUUULT");
    //        console.log(result);
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function addTask(
  { panelId, title, description, date, assignee, columnId },
  boardId
) {
  const query = `mutation($panelId: ID!, $title: String!, $description: String!, $date: String!, $assignee: String!, $columnId: ID!) {
        addTask(panelId: $panelId, title: $title, description: $description, dueDate: $date, assignee: $assignee, columnId: $columnId) {
          id,
          title,
          description,
          dueDate,
          assignee,
          columnId,
        }
    }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error status: ${response.status}, message: ${errorMessage}`
      );
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function addFile({
  panelId,
  taskId,
  filename,
  url,
  size,
  mimetype,
}) {
  const query = `mutation($panelId: ID!, $taskId: ID!, $filename: String!, $url: String!, $size: Int!, $mimetype: String!) {
        addFile(panelId: $panelId, taskId: $taskId, filename: $filename, url: $url, size: $size, mimetype: $mimetype) {
          filename,
          url,
          size,
          mimetype,
          id,
        }
    }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          panelId: panelId,
          taskId: taskId,
          filename: filename,
          url: url,
          size: size,
          mimetype: mimetype,
        },
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error status: ${response.status}, message: ${errorMessage}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function changeTaskColumn(
  panelId,
  taskId,
  columnId,
  dropTargetId
) {
  const query = `mutation($panelId: ID!, $taskId: ID!, $columnId: ID!, $topTaskID: ID) {
        changeTaskColumn(panelId: $panelId, id: $taskId, columnId: $columnId, topTaskID: $topTaskID) {
          id,
          title,
          description,
          dueDate,
          assignee,
          columnId,
        }
    }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          panelId: panelId,
          taskId: taskId,
          columnId: columnId,
          topTaskID: dropTargetId,
        },
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(
        `Error status: ${response.status}, message: ${errorMessage}`
      );
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
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
                }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          panelId: panelId,
          taskId: taskId,
        },
      }),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    console.log(error);
  }
}

export async function removeFile({ id, panelId, taskId }) {
  const query = `mutation RemoveFile($id: ID!, $panelId: ID!, $taskId: ID!) {
                    removeFile(id: $id, panelId: $panelId, taskId: $taskId) {
                        id
                    }
                }`;

  try {
    const response = await fetch(getHost(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          id: id,
          panelId: panelId,
          taskId: taskId,
        },
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}
