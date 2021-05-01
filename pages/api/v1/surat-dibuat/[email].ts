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
      const snapshot = await db.collection("SuratKeluar").get();

      snapshot.forEach((docs) => {
        result.push(docs.data());
      });

      const data = result.filter((v: SuratKeluar) => {
        return v?.author === req.query.email;
      });

      res.status(200).json(data);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
