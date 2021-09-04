import { firestore } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { CreateSuratTugasReqBody, SuratTugasRes } from "../../../../typings/SuratTugas";
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

  if (req.method === "POST" || req.method === "PUT") {
    const { suratTugasId } = req.body as CreateSuratTugasReqBody;

    // Return error if no SuratTugasId supplied
    if (!suratTugasId) {
      res.status(500).json({ error: "Id surat tugas harus diisi!" });
      res.end();
      return;
    }

    console.log("DAtte", firestore.Timestamp.fromDate(new Date()));

    const data: SuratTugasRes = {
      ...req.body,
      createdAt: firestore.Timestamp.fromDate(new Date()),
      editedAt: firestore.Timestamp.fromDate(new Date()),
    };

    try {
      const docRef = db.collection("SuratTugas").doc(suratTugasId);

      const increment = firestore.FieldValue.increment(1);

      const batch = db.batch();
      batch.set(docRef, data);

      if (req.method === "POST") {
        const counterRef = db.collection("SuratTugas").doc("--stats--");
        batch.set(counterRef, { counter: increment }, { merge: true });
      }

      await batch.commit();

      res.status(201).json({ message: "Surat Tugas berhasil dibuat", data: { suratTugasId, ...req.body } });

      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }
};
