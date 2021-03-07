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
      const isAvailable = await db
        .collection("Users")
        .where("email", "==", email)
        .limit(1)
        .get();

      if (!isAvailable.empty) {
        return res.status(400).json({ message: "Email ini telah terdaftar" });
      } else {
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
              role: "default",
            });
          } catch (e) {
            res.status(500).end(e);
          }
          res.status(200).json(data);
        } catch (e) {
          res.status(500).end(e);
        }
      }
    } catch (e) {
      res.status(500).end(e);
    }
  }
};