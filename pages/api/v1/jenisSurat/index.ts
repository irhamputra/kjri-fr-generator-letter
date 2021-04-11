import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../utils/firebase";
import { cors } from "../../../../utils/middlewares";
import { v4 } from "uuid";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await cors(req, res);
  const snapshot = await db.collection("jenisSurat").get();

  if (req.method === "GET") {
    try {
      let result = [];

      snapshot.forEach((doc) => {
        result.push(doc.data());
      });

      res.status(200).json(result);
      res.end();
    } catch (e) {
      res.status(500).json({ error: e.message });
      res.end();
    }
  }

  if (req.method === "POST") {
    try {
      const value = snapshot.docs.length + 1;
      const id = v4();
      await db
        .collection("jenisSurat")
        .doc(id)
        .set({
          ...req.body,
          id,
          value,
        });

      res.status(200).json({ message: "Jenis Surat telah ditambahkan" });
      res.end();
    } catch (e) {
      res.end();
    }
  }
};
