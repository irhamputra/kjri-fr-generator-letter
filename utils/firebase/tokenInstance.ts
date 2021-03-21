import axios from "axios";
import { serviceAccount } from "./serviceAccount";

const tokenInstance = axios.create({
  baseURL: `${process.env.BASE_SECURE_URL}`,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  params: {
    key: serviceAccount.apikey,
  },
});

export default tokenInstance;
