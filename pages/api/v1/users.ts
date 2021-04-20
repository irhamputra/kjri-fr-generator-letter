import { NextApiRequest, NextApiResponse } from "next";
import { cors } from "../../../utils/middlewares";
import { db } from "../../../utils/firebase";

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
};
