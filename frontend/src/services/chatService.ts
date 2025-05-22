import axios from "axios";

export async function sendChatMessage(query: string, language: string) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, { query, language });
  return response.data.response;
}

export async function sendSimplifiedMessage(query: string, language: string) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/simplify`, { query, language });
  return response.data.response;
}

export async function sendAdvancedMessage(query: string, language: string) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/advance`, { query, language });
  return response.data.response;
}