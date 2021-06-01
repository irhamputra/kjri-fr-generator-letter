import { firestore } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const listSurat: FirebaseFirestore.DocumentData = [];

      const allSuratKeluar = await db.collection("SuratKeluar").get();

      allSuratKeluar.forEach((docs) => {
        if (docs.get("content")) {
          listSurat.push(docs.data());
        }
      });

      res.status(200).json({ listSurat, total: allSuratKeluar.docs.length });
      res.end();
    } catch (e) {
      res.status(200).json({ error: e.message });
      res.end();
    }
  }

  if (req.method === "POST" || req.method === "PUT") {
    try {
      const { surat, id, ...restBody } = req.body;

      const docRef = db.collection("SuratKeluar").doc(id);

      const increment = firestore.FieldValue.increment(1);

      const batch = db.batch();
      batch.set(docRef, { id, ...restBody });

      if (req.method === "POST") {
        const counterRef = db.collection("SuratKeluar").doc("--stats--");
        batch.set(counterRef, { counter: increment }, { merge: true });
      }

      await batch.commit();

      res.status(201).json({ message: "Surat Keluar berhasil dibuat", data: { surat, id, ...restBody } });
      res.end();
    } catch (e) {
      res.status(400).json({ error: e.message });

      res.end();
    }
  }
};
