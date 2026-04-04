import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API ERROR:", error?.response || error.message);
    return Promise.reject(error);
  }
);

// ✅ Request Types
export interface ChatRequest {
  question: string;
}

export interface Note {
  id?: number;
  title: string;
  content: string;
  summary?: string;
}

export interface Conversation {
  id: number;
  title: string;
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

export const getConversations = () => {
  return API.get<Conversation[]>("/chat/conversations");
};

export const getMessages = (conversationId: number) => {
  return API.get<Message[]>(`/chat/${conversationId}`);
};

export const askQuestion = (data: ChatRequest) => {
  return API.post<{ conversationId: number; answer: string }>("/chat/conversations", data);
};

export const getNotes = () => {
  return API.get<Note[]>("/notes");
};

export const createNote = (note: Note) => {
  return API.post<Note>("/notes", note);
};

export const sendMessage = (conversationId: number | null, question: string) => {
  return API.post("/chat", question, {
    params: { conversationId },
    headers: { "Content-Type": "text/plain" },
  });
};


export default API;