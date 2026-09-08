import { Task } from '../types/Task';

const API_URL = "http://10.0.2.2:8000/api";

const authHeaders =(
    accessToken: string,
)=>({
  Authorization: `Bearer ${accessToken}`,
})

export const getTasks =
    async (accessToken:string|null) : Promise<Task[]> => {
  const response = await fetch(
      `${API_URL}/tasks/`,
      {
        headers:{
          ...authHeaders(accessToken),
        },
      }
  );
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
}

export const createTask = async (
    accessToken: string,
    title:string,
    description:string,
  ):Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(accessToken),
    },
    body: JSON.stringify({
      title,
      description,
      completed: false,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
};

export const updateTask= async (task:Task):Promise<Task>=>{
  const response = await fetch(`${API_URL}/tasks/${task.id}/`,{
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      completed: task.completed,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
};

export const deleteTask= async (id:number):Promise<void>=>{
  const response = await fetch(`${API_URL}/tasks/${id}`,{
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
};

export const loginAPI= async (
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    })
  });
  if (!response.ok) {
    throw new Error('Wrong login or password');
  }
  return response.json();
};

export const register= async (
    username:string,
    password:string,
    ):Promise<void> => {
  const response = await fetch(`${API_URL}/auth/register`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    })
  });
  if (!response.ok) {
    throw new Error(JSON.stringify(response));
  }
  return response.json();
}
