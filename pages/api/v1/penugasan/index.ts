import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const snapshot = await db.collection("SuratTugas").orderBy("nomorSurat", "asc").get();

      let result = [];

      snapshot.forEach((docs) => {
        if (docs.get("listPegawai")) {
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

  if (req.method === "PUT") {
    const { nomorSurat, listPegawai } = req.body;

    if (listPegawai.length <= 0) {
      res.status(404).json({ error: "Tidak ada data yang tersimpan" });
      res.end();
    }

    try {
      let id = "";

      const snapshot = await db.collection("SuratTugas").where("nomorSurat", "==", nomorSurat).limit(1).get();

      snapshot.forEach((doc) => {
        id = doc.id;
      });

      await db.collection("SuratTugas").doc(id).update({
        listPegawai,
      });

      res.status(200).json({ message: "Update Surat Tugas" });
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
