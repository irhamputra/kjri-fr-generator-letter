import { firestore } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateSuratTugasReqBody } from "../../../../typings/SuratTugas";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const snapshot = await db.collection("SuratTugas").orderBy("updatedAt").get();

      const result: FirebaseFirestore.DocumentData = [];

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
    const { fullDayKurs, nomorSurat, listPegawai, pembuatKomitmenName, pembuatKomitmenNIP } = req.body;

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

      const updateValue = {
        updatedAt: firestore.Timestamp.now(),
        listPegawai,
        fullDayKurs,
        pembuatKomitmen: {
          name: pembuatKomitmenName,
          nip: pembuatKomitmenNIP,
        },
      };

      await db.collection("SuratTugas").doc(id).update(updateValue);

      res.status(200).json({ message: "Update Surat Tugas" });
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
