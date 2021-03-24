import { NextApiRequest, NextApiResponse } from "next";
import authInstance from "../../../utils/firebase/authInstance";
import { AuthResponse } from "../../../typings/AuthResponse";
import { cors } from "../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Login User
   * @method POST
   * @interface AuthResponse
   * @body email & password
   * @return AuthResponse
   */
  await cors(req, res);

  if (req.method === "POST") {
    const { email, password } = req.body;
    try {
      const { data } = await authInstance.post<AuthResponse>(
        "/accounts:signInWithPassword",
        {
          email,
          password,
          returnSecureToken: true,
        }
      );
      res.status(200).json(data);
      res.end();
    } catch (e) {
      res.status(500).json({ message: "Email tidak ditemukan" });
      console.log(e);
      res.end();
    }
  }
};
