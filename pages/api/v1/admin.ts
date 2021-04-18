import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebase";
import { cors } from "../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Admin Settings User
   * @method POST
   * @body email & password
   * @return AuthResponse
   */
  await cors(req, res);

  if (req.method === "GET") {
    let id = "";

    try {
      const snapshot = await db.collection("Admin").get();

      snapshot.forEach((doc) => {
        id = doc.id;
      });

      const doc = await db.collection("Admin").doc(id).get();

      res.status(200).json(doc.data());
      res.end();
    } catch (e) {
      res.status(500).json({ message: e });
      res.end();
    }
  }

  if (req.method === "POST") {
    const { toggle } = req.body;

    let id = "";

    try {
      const snapshot = await db.collection("Admin").where("showRegisterForm", "!=", toggle).get();

      if (snapshot.empty) {
        res.status(400).json({ message: "Pengaturan tidak berubah" });
      } else {
        snapshot.forEach((doc) => {
          id = doc.id;
        });

        await db.collection("Admin").doc(id).update({
          showRegisterForm: toggle,
        });

        res.status(200).json({ message: "Pengaturan tersimpan" });
        res.end();
      }
      res.end();
    } catch (e) {
      res.status(500).json({ message: e });
      res.end();
    }
  }
};
