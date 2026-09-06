import { Task } from 'react-native';

const API_URL = "http://10.0.2.2:8000/api";

export const getTasks = async () => {
  const response = await fetch(`${API_URL}/tasks/`,{});
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
}

export const createTask = async (
  title:string, description:string) => {
  const response = await fetch(`${API_URL}/tasks/`,{
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
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
}