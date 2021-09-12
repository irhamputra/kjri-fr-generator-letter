import axios from "axios";
import { serviceAccount } from "./serviceAccount";

const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://surat-generator.vercel.app/";

const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    key: serviceAccount.apikey,
  },
});

export default apiInstance;
