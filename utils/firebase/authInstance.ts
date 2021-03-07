import axios from "axios";
import { serviceAccount } from "./serviceAccount";

const authInstance = axios.create({
  baseURL: `${process.env.BASE_AUTH_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    key: serviceAccount.apikey,
  },
});

export default authInstance;
