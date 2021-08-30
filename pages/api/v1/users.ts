import { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../../../utils/middlewares";
import { db } from "../../../utils/firebase";
import { v4 } from "uuid";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const result: FirebaseFirestore.DocumentData = [];
      const snapshot = await db.collection("Users").where("role", "==", "default").get();

      snapshot.forEach((doc) => {
        result.push(doc.data());
      });

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }

  if (req.method === "POST") {
    const { email, dob } = req.body;
    const uuid = v4();
    const codeId = uuid.slice(-5);

    const isAvailable = await db.collection("Users").where("email", "==", email).limit(1).get();

    if (!isAvailable.empty) {
      return res.status(404).json({ message: "Email ini telah terdaftar" });
    } else {
      try {
        await db.collection("Users").doc(uuid).set({ email, codeId, uuid });
      } catch (e) {
        res.status(500).end(e);
      }

      res.status(200).json({ codeId });
    }
  }
};
