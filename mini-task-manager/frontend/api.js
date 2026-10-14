const API_URL = "http://localhost:5173/api/tasks";

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const getTasks = () => request(API_URL);

export const createTask = (title) =>
  request(API_URL, {
    method: "POST",
    body: JSON.stringify({ title })
  });

export const updateTask = (id, updates) =>
  request(`${API_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates)
  });

export const deleteTask = (id) =>
  request(`${API_URL}/${id}`, {
    method: "DELETE"
  });



