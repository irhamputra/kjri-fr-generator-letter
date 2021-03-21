import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../utils/firebase";
import { cors } from "../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

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
