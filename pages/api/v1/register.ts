import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebase";
import authInstance from "../../../utils/firebase/authInstance";
import type { AuthResponse } from "../../../typings/AuthResponse";
import { cors } from "../../../utils/middlewares";
import capitalizeFirstLetter from "../../../utils/capitalize";

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
    const { email, password, displayName, nip, golongan, jabatan } = req.body;

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

          await authInstance.post("/accounts:sendOobCode", {
            requestType: "VERIFY_EMAIL",
            idToken: data.idToken,
          });

          try {
            await db
              .collection("Users")
              .doc(data.localId)
              .set({
                uid: data.localId,
                golongan,
                jabatan,
                email,
                displayName: capitalizeFirstLetter(displayName),
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
