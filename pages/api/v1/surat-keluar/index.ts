import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      let listSurat = [];

      const allSuratKeluar = await db.collection("SuratKeluar").get();

      allSuratKeluar.forEach((docs) => {
        listSurat.push(docs.data());
      });

      res.status(200).json({ listSurat, total: allSuratKeluar.docs.length });
      res.end();
    } catch (e) {
      res.status(200).json({ error: e.message });
      res.end();
    }
  }

  if (req.method === "POST") {
    try {
      const { surat, id, ...restBody } = req.body;
      // TODO: get link from storage

      await db
        .collection("SuratKeluar")
        .doc(id)
        .set({
          id,
          ...restBody,
        });

      res.status(200).json({ message: "Surat Keluar berhasil dibuat" });
      res.end();
    } catch (e) {
      res.end();
    }
  }
};
