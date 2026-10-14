const API_URL = "http://localhost:5173/api/tasks";

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // DELETE may return 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Read the response as text first to handle empty bodies
  const text = await response.text();
  let data = {};

  if (text.trim()) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(
        `Server returned invalid JSON (HTTP ${response.status}). Check your API URL and backend.`
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Request failed: HTTP ${response.status}`
    );
  }

  return data;
}

export const getTasks = () => request(API_URL);

export const createTask = (title) =>
  request(API_URL, {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const updateTask = (id, updates) =>
  request(`${API_URL}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

export const deleteTask = (id) =>
  request(`${API_URL}/${id}`, {
    method: "DELETE",
  });
