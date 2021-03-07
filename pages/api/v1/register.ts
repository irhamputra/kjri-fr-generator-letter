import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebase";
import authInstance from "../../../utils/firebase/authInstance";
import type { AuthResponse } from "../../../typings/AuthResponse";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Register User
   * @method POST
   * @body email, password, displayName, NIP
   * @interface AuthResponse
   * @return AuthResponse
   */
  if (req.method === "POST") {
    const { email, password, displayName, nip } = req.body;
    try {
      const { data } = await authInstance.post<AuthResponse>(
        "/accounts:signUp",
        {
          email,
          password,
          returnSecureToken: true,
        }
      );

      try {
        await db.collection("Users").doc(data.localId).set({
          email,
          displayName,
          nip,
        });
      } catch (e) {
        return res.status(500).end(e);
      }
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).end(e);
    }
  }
};
