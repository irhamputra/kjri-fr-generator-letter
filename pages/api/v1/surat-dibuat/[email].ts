import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

interface SuratKeluar {
  arsipId: string;
  author: string;
  content: string;
  id: string;
  jenisSurat: string;
  nomorSurat: string;
  recipient: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const result: FirebaseFirestore.DocumentData = [];
      const snapshot = await db.collection("SuratKeluar").where("author", "==", req.query.email).get();

      snapshot.forEach((docs) => {
        if (docs.get("content") || docs.get("recepient")) {
          result.push(docs.data());
        }
      });

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
