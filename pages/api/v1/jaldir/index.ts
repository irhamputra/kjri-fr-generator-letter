import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";
import { v4 } from "uuid";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);

  if (req.method === "GET") {
    try {
      const result: FirebaseFirestore.DocumentData = [];
      const snapshot = await db.collection("JalDis").orderBy("golongan", "asc").get();

      snapshot.forEach((doc) => {
        result.push(doc.data());
      });

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.end();
    }
  }

  if (req.method === "POST") {
    try {
      const golId = v4();

      await db.collection("JalDis").doc(golId).set({
        golId,
        golongan: req.body.jenisGolongan,
        harga: req.body.hargaGolongan,
      });
      res.status(200).json({ message: "Data berhasil disimpan" });
      res.end();
    } catch (e) {
      res.end();
    }
  }

  if (req.method === "PUT") {
    try {
      await db
        .collection("JalDis")
        .doc(req.body.golId as string)
        .update({
          harga: req.body.hargaGolongan,
          golongan: req.body.jenisGolongan,
          golId: req.query.id,
        });

      res.status(200).json({ message: "Golongan telah di upadate" });
      res.end();
    } catch (e) {
      res.end();
    }
  }
};
