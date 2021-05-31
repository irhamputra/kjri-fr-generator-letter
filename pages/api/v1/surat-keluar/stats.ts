import { firestore } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const stats = await db.collection("SuratKeluar").doc("--stats--").get();
      res.status(200).json(stats.data() );
      res.end();
    } catch (e) {
      res.status(200).json({ error: e.message });
      res.end();
    }
  }
};
