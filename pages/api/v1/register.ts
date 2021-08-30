import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebase";
import authInstance from "../../../utils/firebase/authInstance";
import type { AuthResponse } from "../../../typings/AuthResponse";
import { cors } from "../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Register User
   * @method POST
   * @body email, password, displayName, NIP
   * @interface AuthResponse
   * @return AuthResponse
   */
  await cors(req, res);

  if (req.method === "POST") {
    const { email, password, uid } = req.body;

    try {
      try {
        const { data } = await authInstance.post<AuthResponse>("/accounts:signUp", {
          email,
          password,
          returnSecureToken: true,
        });

        await authInstance.post("/accounts:sendOobCode", {
          requestType: "VERIFY_EMAIL",
          idToken: data.idToken,
        });

        try {
          await db.collection("Users").doc(uid).set({
            uid,
            email,
            role: "default",
            nip: "",
            displayName: "",
            golongan: "",
            jabatan: "",
          });
        } catch (e) {
          res.status(500).end(e);
        }
        res.status(200).json(data);
      } catch (e) {
        res.status(500).end(e);
      }
    } catch (e) {
      res.status(500).end(e);
    }
  }
};
