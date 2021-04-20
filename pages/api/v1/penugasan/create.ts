import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const snapshot = await db.collection("SuratTugas").orderBy("nomorSurat", "asc").get();

      const result: FirebaseFirestore.DocumentData = [];

      snapshot.forEach((docs) => {
        if (!docs.get("listPegawai")) {
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
