import { NextApiRequest, NextApiResponse } from "next";
import authInstance from "../../../utils/firebase/authInstance";
import { AuthResponse } from "../../../typings/AuthResponse";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Login User
   * @method POST
   * @interface AuthResponse
   * @body email & password
   * @return AuthResponse
   */
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
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json(e);
    }
  }
};
