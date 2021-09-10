import { firestore } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import { SuratKeluarCollection } from "../../../../typings/SuratKeluar";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const listSurat: FirebaseFirestore.DocumentData = [];

      const allSuratKeluar = await db.collection("SuratKeluar").orderBy("editedAt", "desc").get();

      allSuratKeluar.forEach((docs) => {
        const data = docs.data();
        const time = {
          createdAt: data.createdAt?.toDate(),
          editedAt: data.editedAt?.toDate(),
        };
        if (docs.get("content")) {
          listSurat.push({ ...data, ...time });
        }
      });

      res.status(200).json({ listSurat, total: listSurat.length });
      res.end();
    } catch (e) {
      res.status(200).json({ error: e.message });
      res.end();
    }
  }

  if (req.method === "POST" || req.method === "PUT") {
    try {
      const { surat, id, ...restBody } = req.body;
      // Only edit createdAt on POST
      const date =
        req.method === "POST"
          ? {
              createdAt: firestore.Timestamp.now(),
              editedAt: firestore.Timestamp.now(),
            }
          : {
              editedAt: firestore.Timestamp.now(),
            };

      const storedValues: SuratKeluarCollection = {
        ...restBody,
        id,
        ...date,
      };

      const docRef = db.collection("SuratKeluar").doc(id);
      const increment = firestore.FieldValue.increment(1);
      const batch = db.batch();

      if (req.method === "POST") {
        batch.set(docRef, storedValues);
        const counterRef = db.collection("SuratKeluar").doc("--stats--");
        batch.set(counterRef, { counter: increment }, { merge: true });
      } else {
        batch.update(docRef, storedValues);
      }

      await batch.commit();

      res.status(201).json({ message: "Surat Keluar berhasil dibuat", data: storedValues });
      res.end();
    } catch (e) {
      res.status(400).json({ error: e.message });

      res.end();
    }
  }
};
