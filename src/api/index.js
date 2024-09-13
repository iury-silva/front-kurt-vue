import axios from "axios";

const api = axios.create({
  baseURL: "https://noodletop.com.br/api/kurt/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;