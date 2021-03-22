import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const getAllSuratTugas = await db.collection("SuratTugas").get();

      res.status(200).json({ total: getAllSuratTugas.docs.length });
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }

  if (req.method === "POST") {
    const { suratTugasId } = req.body;

    try {
      await db.collection("SuratTugas").doc(suratTugasId).set(req.body);
      res.status(200);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
