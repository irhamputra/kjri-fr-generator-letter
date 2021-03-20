import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const allSuratKeluar = await db.collection("SuratKeluar").get();

      res.status(200).json({ total: allSuratKeluar.docs.length });
      res.end();
    } catch (e) {
      res.status(200).json({ error: e.message });
      res.end();
    }
  }
};
