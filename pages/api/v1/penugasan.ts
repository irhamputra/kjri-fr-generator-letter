import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const snapshot = await db.collection("SuratTugas").get();

      let result = [];

      snapshot.forEach((docs) => {
        result.push(docs.data());
      });

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
